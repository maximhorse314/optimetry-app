import FileSaver from 'file-saver'
import mapKeys from 'lodash/mapKeys'
import XLSX from 'xlsx'
import { removeKeys } from './utils'

export default ({
	mediaBudget,
	mediaChannels: mc,
	salesChannels: sc,
	channels,
	salesForecast: sf
}) => ({
	media_budget: mediaBudget,
	media_channels: removeKeys(mc, ['tableData']),
	sales_channels: mc.map(({ Media, Channel }, key) => ({
		Media,
		Channel,
		...mapKeys(sc[key], (_, k) => channels.find(({ key }) => key === k).label)
	})),
	sales_forecast: removeKeys(sf, ['tableData']).map(({ Target, Period, ...other }) => ({
		Target,
		Period: Period.toString(),
		...mapKeys(other, (_, k) => channels.find(({ key }) => key === k).label + ' Sales')
	}))
})

const json2Sheet = data =>
	XLSX.utils.json_to_sheet(data, data.length ? { headers: Object.keys(data[0]) } : null)

export const exportAsExcel = ({
	media_budget,
	media_channels,
	sales_channels,
	sales_forecast
}, intl) => {
	const wsmb = json2Sheet([{'Media Budget': media_budget}])
	// wsmb['A1'].s = { fontWeight: 'bold', border: '1px solid black' }

	const wsmc = json2Sheet(media_channels)
	const wssc = json2Sheet(sales_channels)
	const wssf = json2Sheet(sales_forecast.map(({ Period, Target, ...other }) => ({
		Period: intl.formatDate(Number(Period), { format: 'numericDate' }),
		...other,
		Target: Target ? 'Yes' : 'No',
	})))
	
	const wb = XLSX.utils.book_new()
	XLSX.utils.book_append_sheet(wb, wsmb, 'Media Budget')
	XLSX.utils.book_append_sheet(wb, wsmc, 'Media Channels')
	XLSX.utils.book_append_sheet(wb, wssc, 'Sales Channels')
	XLSX.utils.book_append_sheet(wb, wssf, 'Sales Forecast')

	const xlsx = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type:'array' })
	const blob = new Blob([xlsx], { type: 'application/octet-stream' })
	
	FileSaver.saveAs(blob, 'scenario.xlsx')
}

export const getImportData = data => {
	const blob = new Uint8Array(data)
	const workbook = XLSX.read(blob, { type: 'array' })
	const wsmb  = workbook.Sheets['Media Budget']
	const wsmc  = workbook.Sheets['Media Channels']
	const wssc  = workbook.Sheets['Sales Channels']
	const wssf  = workbook.Sheets['Sales Forecast']

	let media_budget = 0
	let media_channels = []
	let sales_channels = []
	let sales_forecast = []

	if (wsmb) {
		const mb = XLSX.utils.sheet_to_json(wsmb)
		if (mb.length && mb[0]['Media Budget'] !== undefined) {
			media_budget = mb[0]['Media Budget']
		}
	}

	if (wsmc) {
		media_channels = XLSX.utils.sheet_to_json(wsmc)
	}

	if (wssc) {
		sales_channels = XLSX.utils.sheet_to_json(wssc)
	}

	if (wssf) {
		sales_forecast = XLSX.utils
			.sheet_to_json(wssf)
			.map(({ Period, Target, ...other }) => ({
				Period: new Date(Period).getTime(),
				Target: Target === 'Yes' ? 1 : 0,
				...other
			}))
	}

	return {
		media_budget,
		media_channels,
		sales_channels,
		sales_forecast,
	}
}

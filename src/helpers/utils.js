export const uuid = () =>
  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

export const removeKeys = (data, keys) =>
	data.map(row => {
		const v = { ...row }
		keys.forEach(key => delete v[key])
		return v
	})

export const setKeys = (data, keys) =>
	data.map(row => {
		const v = {}
		keys.forEach(({ key, default: def }) =>
			v[key] = (row[key] === undefined ? def : row[key]))
		return v
	})

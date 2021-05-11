import fp from 'lodash/fp'

const subSelector = (subname, defaultValue = null) =>
  fp.compose(
    fp.defaultTo(defaultValue),
    fp.get(subname),
    fp.get('salesChannels')
  )

export const salesChannelsSelector = subSelector('data')

export const channelsSelector = subSelector('channels')


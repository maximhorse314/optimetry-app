export default {
  locale: 'en',
  formats: {
    date: {
      numericDate: {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      },
      monthAndYear: {
        month: 'long',
        year: 'numeric'
      },
      dayMonthAndYear: {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      },
      year: {
        year: 'numeric'
      },
      shortDMY: {
        year: '2-digit',
        month: 'short',
        day: '2-digit'
      },
      twoDigit: {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit'
      }
    },
    time: {
      short: {
        hour: 'numeric',
        minute: 'numeric'
      },
      long: {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }
    },
    number: {
      currency: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      },
      currencyWithoutCents: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      },
      percentOne: {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      },
      percentRounded: {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      },
      decimalOne: {
        style: 'decimal',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      },
      decimalRound: {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      },
      decimalTwoPossible: {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }
    }
  }
}

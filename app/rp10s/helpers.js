const moment = require('moment')

function formatDurationDisplay(input) {
  const duration = moment.duration(input, 'seconds') // TODO use milliseconds
  let durationDisplayH = duration.hours()
  let durationDisplayM = duration.minutes()
  let durationDisplayS = duration.seconds()
  let durationDisplayMs = duration.milliseconds()
  let durationDisplay = `${durationDisplayS}`

  // add leading 0 to seconds
  if (durationDisplay.length === 1) {
    durationDisplay = `0${durationDisplayS}`
  }

  // add leading colon to seconds
  durationDisplay = `:${durationDisplay}`

  if (durationDisplayM) {
    // add leading 0 to minutes for hours
    if (durationDisplayH && durationDisplayM.length === 1) {
      durationDisplayM = `0${durationDisplayM}`
    }

    // add minutes
    durationDisplay = `${durationDisplayM}${durationDisplay}`
  } else if (durationDisplayH) {
    // add empty minutes for hours
    durationDisplay = `00${durationDisplay}`
  }

  // add hours
  if (durationDisplayH) {
    durationDisplay = `${durationDisplayH}:${durationDisplay}`
  }

  // round up to nearest 100th and add 10th's place
  const tenths = (Math.ceil(duration.milliseconds() / 100) * 100).toString()[0]
  if (durationDisplayMs) {
    durationDisplay = `${durationDisplay}.${tenths}`
  }

  return durationDisplay
}

function toSecondsProFormat(rp10, goalTimes) {
  return goalTimes.map((goalTime, idx) => {
    const name = goalTime.name || `Group ${idx + 1}`
    const intervals = []
    while (intervals.length !== rp10.repCount) {
      intervals.push(rp10.repCount)
    }

    return {
      name,
      intervals: intervals.map((repCount, jdx) => {
        const iname = `rep ${jdx + 1} → ${repCount}x${rp10.todaysRepeats} target: ${formatDurationDisplay(goalTime.target)}`
        return {
          name: iname,
          duration: goalTime.interval,
          color: 3
        }
      }),
      numberOfSets: 1,
      type: 0,
      soundScheme: 8,
      via: 'web'
    }
  })
}

module.exports = {
  formatDurationDisplay,
  toSecondsProFormat,
}

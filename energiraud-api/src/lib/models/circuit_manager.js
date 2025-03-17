

/**
 * Toggle on a machine
 * @param {string} ip - The ip address of the machine
 * @param {number} port - The port of the machine
 */
async function toggleOn(ip, port) {
  console.log("toggleOn", ip, port)
}

/**
 * Toggle off a machine
 * @param {string} ip - The ip address of the machine
 * @param {number} port - The port of the machine
 */
async function toggleOff(ip, port) {
  console.log("toggleOff", ip, port)
}

/**
 * Delay an action
 * @param {string} action - The action to perform
 * @param {string} ip - The ip address of the machine
 * @param {number} port - The port of the machine
 * @param {number} delay - The delay in milliseconds
 */
async function delayAction(action, ip, port, delay) {
  setTimeout(() => {
    if (action === "toggleOn") {
      toggleOn(ip, port)
    } else if (action === "toggleOff") {
      toggleOff(ip, port)
    } else {
      console.log("Invalid action - " + action)
    }
  }, delay)
}

export { toggleOn, toggleOff, delayAction }



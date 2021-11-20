export const SYSTEM_LOG_ID = '__SYSTEM__LOG__'

const log_el = document.getElementById(SYSTEM_LOG_ID)

if (log_el) {
  log_el.onclick = () => {
    log_el.innerHTML = ''
  }
}
export function log(...args: any[]) {
  console.log(...args)
  if (log_el) {
    const message = args.join(' ')
    const messageDiv = document.createElement('div')
    messageDiv.innerText = message
    log_el && log_el.appendChild(messageDiv)
  }
}

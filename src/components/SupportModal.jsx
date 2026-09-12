import { useEffect } from 'react'

function SupportModal({ config, onClose }) {
  useEffect(() => {
    function onKeyDown(event) {
      if (event.code === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="support-modal" role="dialog" aria-modal="true" aria-label={config.heading}>
      <div className="support-modal__backdrop" onClick={onClose} />

      <div className="support-modal__card">
        <button
          type="button"
          className="support-modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="support-modal__icon" aria-hidden="true">
          ❤️
        </div>

        <h2 className="support-modal__heading">{config.heading}</h2>
        <p className="support-modal__body">{config.body}</p>

        <div className="support-modal__qr">
          <img src={config.qrImageUrl} alt={config.qrImageAlt} />
        </div>

        <a
          className="support-modal__download"
          href={config.qrImageUrl}
          download={config.downloadFileName}
        >
          ⬇ {config.downloadLabel}
        </a>

        {config.footnote && <p className="support-modal__footnote">{config.footnote}</p>}

        <button type="button" className="support-modal__dismiss" onClick={onClose}>
          {config.dismissLabel}
        </button>
      </div>
    </div>
  )
}

export default SupportModal

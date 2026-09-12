function Footer({ credit, supportLabel, onSupportClick }) {
  return (
    <footer className="site-footer">
      <span>{credit}</span>
      {supportLabel && (
        <button type="button" className="site-footer__support" onClick={onSupportClick}>
          {supportLabel}
        </button>
      )}
    </footer>
  )
}

export default Footer

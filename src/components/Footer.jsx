function Footer({ credit, supportUrl }) {
  return (
    <footer className="site-footer">
      <span>{credit}</span>
      {supportUrl && (
        <a href={supportUrl} target="_blank" rel="noreferrer">
          Support this
        </a>
      )}
    </footer>
  )
}

export default Footer

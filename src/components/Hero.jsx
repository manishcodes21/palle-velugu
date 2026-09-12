function Hero({ hero }) {
  return (
    <div className="hero">
      <img className="hero__image" src={hero.imageUrl} alt={hero.imageAlt} />
      <div className="hero__scrim" />
      <div className="hero__grain" />
    </div>
  )
}

export function Atmosphere({ hero }) {
  return (
    <div className="atmosphere">
      <p className="atmosphere__kicker">{hero.kicker}</p>
      <h1 className="atmosphere__title">{hero.titleTelugu}</h1>
      <p className="atmosphere__transliteration">{hero.titleTransliteration}</p>
      <p className="atmosphere__copy">{hero.copy}</p>
    </div>
  )
}

export default Hero

function Header({ name, title, contactInfo, themeColor = '#1d4ed8' }) {
  return (
    <header className="portfolio-header" style={{ borderBottomColor: themeColor }}>
      <h1 style={{ color: themeColor }}>{name}</h1>
      <p className="header-subtitle">{title}</p>
      {contactInfo && (
        <div className="header-contact">
          <span>Email: <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a></span>
          <span> | Phone: {contactInfo.phone}</span>
          <span> | Roll No: {contactInfo.rollNo}</span>
        </div>
      )}
    </header>
  );
}

export default Header;

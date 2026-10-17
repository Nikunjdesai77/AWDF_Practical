function Footer({ contactEmail = 'desainikunj121@gmail.com', phone = '+91-8200388025', rollNo = '24CS016' }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="portfolio-footer">
      <p>
        Email: <a href={`mailto:${contactEmail}`}>{contactEmail}</a> | Phone: {phone} | Roll No: {rollNo}
      </p>
      <p>&copy; {currentYear} Nikunj Desai. AWDF (ITUE301) Practical 1 Submission.</p>
    </footer>
  );
}

export default Footer;

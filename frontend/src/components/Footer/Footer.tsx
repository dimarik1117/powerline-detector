import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__content">
        <span>
          Обнаружение и классификация опор ЛЭП © 2026
        </span>

        <a
          href="https://github.com/dimarik1117/powerline-detector"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github: https://github.com/dimarik1117/powerline-detector
        </a>
      </div>
    </footer>
  );
}
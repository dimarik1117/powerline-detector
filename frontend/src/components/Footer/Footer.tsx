import './Footer.css';

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
          title="Открыть репозиторий на GitHub"
        >
          Открыть репозиторий на GitHub
        </a>
      </div>
    </footer>
  );
}
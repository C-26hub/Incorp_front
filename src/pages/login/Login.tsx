import { useState, type FormEvent } from "react";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<"erro" | "sucesso" | "">("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMensagem("");
    setTipoMensagem("");

    if (!email.trim() || !senha.trim()) {
      setMensagem("Preencha o e-mail corporativo e a senha.");
      setTipoMensagem("erro");
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(email)) {
      setMensagem("Informe um e-mail corporativo válido.");
      setTipoMensagem("erro");
      return;
    }

    // Futuramente será substituído pela chamada à API.
    console.log({
      email,
      lembrar,
    });

    setMensagem(
      "Dados validados. A autenticação será integrada ao servidor posteriormente."
    );
    setTipoMensagem("sucesso");
  }

  function handleCadastro() {
    /*
      Na próxima etapa usaremos React Router:
      navigate("/cadastro");
    */

    console.log("Navegar para cadastro");
  }

  return (
    <main className="auth-container">
      {/* PAINEL INSTITUCIONAL */}

      <section className="brand-panel">
        <div className="brand-content">
          <div className="logo">
            <span className="logo-icon">A</span>
            <span className="logo-text">GENTE</span>
          </div>

          <div className="brand-message">
            <span className="eyebrow">
              PLATAFORMA CORPORATIVA DE AGENTES DE IA
            </span>

            <h1>
              OTIMIZE.
              <br />
              <span>SUA ROTINA.</span>
            </h1>

            <p>
              Centralize informações, organize processos e facilite a gestão da
              sua equipe em um único ambiente.
            </p>
          </div>

          <div className="features">
            <div className="feature">
              <span className="feature-icon">✓</span>

              <div>
                <strong>Gestão</strong>
                <small>Informações centralizadas</small>
              </div>
            </div>

            <div className="feature">
              <span className="feature-icon">✓</span>

              <div>
                <strong>Segurança</strong>
                <small>Acesso corporativo</small>
              </div>
            </div>

            <div className="feature">
              <span className="feature-icon">✓</span>

              <div>
                <strong>Organização</strong>
                <small>Processos mais eficientes</small>
              </div>
            </div>
          </div>
        </div>

        <div className="brand-footer">
          © 2026 Sistema de Gestão
        </div>
      </section>

      {/* LOGIN */}

      <section className="form-panel">
        <div className="login-wrapper">
          <header className="form-header">
            <span className="mobile-logo">A GENTE</span>

            <span className="form-label">
              ACESSO CORPORATIVO
            </span>

            <h2>Bem-vindo</h2>

            <p>
              Entre com seus dados corporativos para acessar o sistema.
            </p>
          </header>

          <div className="login-heading">
            <span>Entrar</span>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* EMAIL */}

            <div className="input-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder=" "
                autoComplete="email"
              />

              <label htmlFor="email">
                E-mail corporativo
              </label>

              <span className="input-line" />
            </div>

            {/* SENHA */}

            <div className="input-group password-group">
              <input
                type={mostrarSenha ? "text" : "password"}
                id="senha"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                placeholder=" "
                autoComplete="current-password"
              />

              <label htmlFor="senha">
                Senha
              </label>

              <span className="input-line" />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setMostrarSenha(!mostrarSenha)}
              >
                {mostrarSenha ? "Ocultar" : "Mostrar"}
              </button>
            </div>

            {/* OPÇÕES */}

            <div className="form-options">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={lembrar}
                  onChange={(event) =>
                    setLembrar(event.target.checked)
                  }
                />

                <span className="checkbox" />

                Lembrar acesso
              </label>

              <button
                type="button"
                className="forgot-password"
              >
                Esqueci minha senha
              </button>
            </div>

            {/* MENSAGEM */}

            {mensagem && (
              <div className={`message ${tipoMensagem}`}>
                {mensagem}
              </div>
            )}

            {/* ENTRAR */}

            <button
              type="submit"
              className="primary-button"
            >
              <span>Entrar</span>
              <span className="arrow">→</span>
            </button>

            {/* CADASTRO */}

            <p className="register-link">
              Primeiro acesso?{" "}

              <button
                type="button"
                onClick={handleCadastro}
              >
                Criar minha conta
              </button>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
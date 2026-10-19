
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import incorpLogo from "../../assets/incorp-technology-logo.png";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(true);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");
    setAviso("");

    if (!email.trim() || !senha.trim()) {
      setErro("Preencha seu e-mail e sua senha para continuar.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErro("Informe um e-mail válido.");
      return;
    }

    // Demonstração: sem autenticação real.
    navigate("/", { replace: true });
  }

  return (
    <main className="login-shell min-h-screen overflow-hidden text-white">
      <div className="login-glow login-glow-one" />
      <div className="login-glow login-glow-two" />
      <div className="login-grid" />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-5 sm:p-8 lg:p-12">
        <div className="grid w-full max-w-[1120px] overflow-hidden rounded-[28px] border border-white/20 bg-white/10 shadow-[0_32px_90px_rgba(24,26,79,0.34)] backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">

          {/* PAINEL ESQUERDO */}
          <section className="relative hidden min-h-[620px] flex-col justify-between overflow-hidden p-10 lg:flex">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-[#292B78]/20 to-[#292B78]/45" />

            <div className="absolute -left-32 bottom-0 h-64 w-[125%] -rotate-[8deg] rounded-[50%] bg-[#00AFEE]/20 blur-3xl" />

            <div className="relative">
              <img
                src={incorpLogo}
                alt="Incorp Technology"
                className="incorp-logo-on-dark h-20 w-auto object-contain"
              />
            </div>

            <div className="relative mx-auto max-w-[500px] text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3D3F94]">
                <span className="h-2 w-2 rounded-full bg-[#00AFEE]" />
                Inteligência aplicada ao negócio
              </span>

              <h1 className="mt-6 text-[44px] leading-[1.08] font-extrabold tracking-[-0.035em] text-[#25263A]">
                Seus agentes de IA,
                <span className="block text-[#3D3F94]">
                  em um só lugar.
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-[430px] text-[15px] leading-7 text-white/75">
                Centralize operações de Marketing e Comercial,
                automatize tarefas e transforme dados em
                decisões mais inteligentes.
              </p>
            </div>

            <div className="relative flex items-center gap-2 text-[11px] text-white/60">
              <ShieldCheck size={15} />
              Ambiente seguro e exclusivo para colaboradores Incorp
            </div>
          </section>

          {/* PAINEL DIREITO */}
          <section className="flex min-h-[620px] items-center bg-white px-6 py-8 text-[#25263A] sm:px-12 lg:px-14">
            <div className="mx-auto w-full max-w-[400px]">

              {/* LOGO MOBILE */}
              <div className="mb-8 flex justify-center lg:hidden">
                <img
                  src={incorpLogo}
                  alt="Incorp Technology"
                  className="h-20 w-auto object-contain"
                />
              </div>

              {/* CABEÇALHO */}
              <header className="mb-8">
                <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#3D3F94]">
                  Incorp AI
                </span>

                <h2 className="mt-3 text-[30px] font-extrabold tracking-[-0.035em] text-[#25263A]">
                  Bem-vindo de volta
                </h2>

                <p className="mt-2 text-[14px] leading-6 text-[#6B7080]">
                  Acesse sua conta corporativa para continuar.
                </p>
              </header>

              {/* FORMULÁRIO */}
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                {/* EMAIL */}
                <label className="block">
                  <span className="mb-2 block text-[12.5px] font-semibold text-[#3D4056]">
                    E-mail corporativo
                  </span>

                  <span className="relative block">
                    <Mail
                      size={17}
                      className="absolute top-1/2 left-3.5 -translate-y-1/2 text-[#9DA3B4]"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="nome@incorp.com.br"
                      autoComplete="email"
                      className="h-12 w-full rounded-xl border border-[#DFE2EC] bg-[#F9FAFD] pr-4 pl-11 text-[14px] text-[#25263A] outline-none transition-all placeholder:text-[#ADB2C1] focus:border-[#3D3F94] focus:bg-white focus:ring-4 focus:ring-[#3D3F94]/10"
                    />
                  </span>
                </label>

                {/* SENHA */}
                <label className="block">
                  <span className="mb-2 block text-[12.5px] font-semibold text-[#3D4056]">
                    Senha
                  </span>

                  <span className="relative block">
                    <LockKeyhole
                      size={17}
                      className="absolute top-1/2 left-3.5 -translate-y-1/2 text-[#9DA3B4]"
                    />

                    <input
                      type={mostrarSenha ? "text" : "password"}
                      value={senha}
                      onChange={(event) => setSenha(event.target.value)}
                      placeholder="Digite sua senha"
                      autoComplete="current-password"
                      className="h-12 w-full rounded-xl border border-[#DFE2EC] bg-[#F9FAFD] pr-12 pl-11 text-[14px] text-[#25263A] outline-none transition-all placeholder:text-[#ADB2C1] focus:border-[#3D3F94] focus:bg-white focus:ring-4 focus:ring-[#3D3F94]/10"
                    />

                    <button
                      type="button"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                      className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1.5 text-[#9DA3B4] hover:bg-[#EEF0F7] hover:text-[#3D3F94]"
                    >
                      {mostrarSenha ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </span>
                </label>

                {/* OPÇÕES */}
                <div className="flex items-center justify-between gap-4">
                  <label className="flex cursor-pointer items-center gap-2.5 text-[12.5px] text-[#6B7080]">
                    <input
                      type="checkbox"
                      checked={lembrar}
                      onChange={(event) => setLembrar(event.target.checked)}
                      className="h-4 w-4 accent-[#3D3F94]"
                    />
                    Lembrar de mim
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setErro("");
                      setAviso("Recuperação de senha ainda não implementada.");
                    }}
                    className="text-[12.5px] font-semibold text-[#3D3F94] hover:text-[#00AFEE]"
                  >
                    Esqueceu sua senha?
                  </button>
                </div>

                {/* MENSAGENS */}
                {erro && (
                  <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-[12.5px] text-red-700">
                    {erro}
                  </div>
                )}

                {aviso && (
                  <div role="status" className="rounded-xl border border-[#DFE2EC] bg-[#F9FAFD] px-3.5 py-3 text-[12.5px] text-[#3D3F94]">
                    {aviso}
                  </div>
                )}

                {/* ENTRAR */}
                <button
                  type="submit"
                  className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#3D3F94] text-[14px] font-semibold text-white shadow-lg shadow-[#3D3F94]/20 transition-all hover:-translate-y-0.5 hover:bg-[#2E3078]"
                >
                  Entrar
                  <ArrowRight size={16} />
                </button>
              </form>

              {/* DIVISOR */}
              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-[#E4E6EF]" />
                <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#9DA3B4]">
                  ou continue com
                </span>
                <span className="h-px flex-1 bg-[#E4E6EF]" />
              </div>

              {/* GOOGLE */}
              <button
                type="button"
                onClick={() => {
                  setErro("");
                  setAviso("Login com Google ainda não integrado.");
                }}
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-[#DFE2EC] bg-white text-[13.5px] font-semibold text-[#3D4056] hover:bg-[#F9FAFD]"
              >
                <span className="text-lg font-bold text-[#4285F4]">
                  G
                </span>
                Entrar com Google
              </button>

            
{/* CADASTRO */}
<p className="mt-6 text-center text-[12.5px] text-[#6B7080]">
  Ainda não possui uma conta?{" "}
  <button
    type="button"
    onClick={() => navigate("/cadastro")}
    className="font-semibold text-[#3D3F94] hover:text-[#00AFEE]"
  >
    Cadastre-se
  </button>
</p>


              {/* RODAPÉ */}
              <p className="mt-8 text-center text-[11.5px] leading-5 text-[#9DA3B4]">
                Ao acessar, você concorda com os termos de uso
                e a política de privacidade da Incorp Technology.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}


import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import incorpLogo from "../../assets/incorp-technology-logo.png";
import "../login/Login.css";

type Campo = "name" | "cpf" | "email" | "role" | "password" | "confirmPassword";

const campos: {
  key: Campo;
  label: string;
  type: string;
  placeholder: string;
  autoComplete: string;
}[] = [
  { key: "name", label: "Nome completo", type: "text", placeholder: "Digite seu nome", autoComplete: "name" },
  { key: "cpf", label: "CPF", type: "text", placeholder: "000.000.000-00", autoComplete: "off" },
  { key: "email", label: "E-mail corporativo", type: "email", placeholder: "nome@incorp.com.br", autoComplete: "email" },
  { key: "role", label: "Cargo", type: "text", placeholder: "Ex.: Analista de Marketing", autoComplete: "organization-title" },
  { key: "password", label: "Senha", type: "password", placeholder: "Mínimo de 6 caracteres", autoComplete: "new-password" },
  { key: "confirmPassword", label: "Confirmar senha", type: "password", placeholder: "Repita sua senha", autoComplete: "new-password" },
];

export default function Cadastro() {
  const navigate = useNavigate();

  const [form, setForm] = useState<Record<Campo, string>>({
    name: "",
    cpf: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  function formatCpf(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  function updateField(field: Campo, value: string) {
    setForm((current) => ({
      ...current,
      [field]: field === "cpf" ? formatCpf(value) : value,
    }));
    setErro("");
    setSucesso(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");
    setSucesso(false);

    if (Object.values(form).some((value) => !value.trim())) {
      setErro("Preencha todos os campos para continuar.");
      return;
    }

    if (form.cpf.replace(/\D/g, "").length !== 11) {
      setErro("Informe um CPF com 11 dígitos.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErro("Informe um e-mail válido.");
      return;
    }

    if (form.password.length < 6) {
      setErro("A senha deve possuir pelo menos 6 caracteres.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErro("As senhas informadas não coincidem.");
      return;
    }

    // Apenas validação demonstrativa.
    // Nenhuma conta é criada e nenhum dado é enviado.
    setSucesso(true);
  }

  return (
    <main className="login-shell min-h-screen overflow-hidden text-white">
      <div className="login-glow login-glow-one" />
      <div className="login-glow login-glow-two" />
      <div className="login-grid" />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-5 sm:p-8 lg:p-12">
        <div className="grid w-full max-w-[1120px] overflow-hidden rounded-[28px] border border-white/20 bg-white/10 shadow-[0_32px_90px_rgba(24,26,79,0.34)] backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]">

          {/* PAINEL ESQUERDO */}
          <section className="relative hidden min-h-[680px] flex-col justify-between overflow-hidden p-12 lg:flex">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-[#292B78]/20 to-[#292B78]/45" />

            <img
              src={incorpLogo}
              alt="Incorp Technology"
              className="incorp-logo-on-dark relative h-20 w-auto self-start object-contain"
            />

            <div className="relative mx-auto max-w-[410px] text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3D3F94]">
                <span className="h-2 w-2 rounded-full bg-[#00AFEE]" />
                Sua jornada começa aqui
              </span>

              <h1 className="mt-6 text-[40px] leading-[1.1] font-extrabold tracking-[-0.035em] text-[#25263A]">
                Crie sua conta e conecte-se ao
                <span className="block text-[#3D3F94]">
                  futuro do trabalho.
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-[390px] text-[14px] leading-7 text-white/75">
                Tenha acesso aos agentes inteligentes da Incorp e
                potencialize sua rotina desde o primeiro acesso.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="relative flex items-center gap-2 self-start text-[12px] font-medium text-white/70 hover:text-white"
            >
              <ArrowLeft size={15} />
              Voltar para o login
            </button>
          </section>

          {/* FORMULÁRIO */}
          <section className="flex min-h-[680px] items-center bg-white px-6 py-10 text-[#25263A] sm:px-12 lg:px-14">
            <div className="mx-auto w-full max-w-[520px]">

              <div className="mb-7 flex justify-center lg:hidden">
                <img
                  src={incorpLogo}
                  alt="Incorp Technology"
                  className="h-16 w-auto object-contain"
                />
              </div>

              <header className="mb-7">
                <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#3D3F94]">
                  Cadastro
                </span>
                <h2 className="mt-2 text-[28px] font-extrabold tracking-[-0.035em]">
                  Crie sua conta
                </h2>
                <p className="mt-1.5 text-[13.5px] leading-6 text-[#6B7080]">
                  Preencha seus dados para acessar a plataforma.
                </p>
              </header>

              <form onSubmit={handleSubmit} noValidate>
                <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
                  {campos.map((campo) => (
                    <label key={campo.key} className="block">
                      <span className="mb-1.5 block text-[12px] font-semibold text-[#3D4056]">
                        {campo.label}
                      </span>

                      <input
                        type={campo.type}
                        value={form[campo.key]}
                        onChange={(event) =>
                          updateField(campo.key, event.target.value)
                        }
                        placeholder={campo.placeholder}
                        autoComplete={campo.autoComplete}
                        inputMode={campo.key === "cpf" ? "numeric" : undefined}
                        className="h-11 w-full rounded-xl border border-[#DFE2EC] bg-[#F9FAFD] px-3.5 text-[13px] text-[#25263A] outline-none placeholder:text-[#ADB2C1] focus:border-[#3D3F94] focus:bg-white focus:ring-4 focus:ring-[#3D3F94]/10"
                      />
                    </label>
                  ))}
                </div>

                {erro && (
                  <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-[12px] text-red-700">
                    {erro}
                  </div>
                )}

                {sucesso && (
                  <div role="status" className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-3 text-[12px] text-[#3D3F94]">
                    Dados validados! O cadastro será concluído quando
                    integrarmos o servidor.
                  </div>
                )}

                <button
                  type="submit"
                  className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#3D3F94] text-[14px] font-semibold text-white hover:bg-[#2E3078]"
                >
                  Validar cadastro
                  <ArrowRight size={16} />
                </button>
              </form>

              <p className="mt-6 text-center text-[12.5px] text-[#6B7080]">
                Já possui uma conta?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="font-semibold text-[#3D3F94] hover:text-[#00AFEE]"
                >
                  Entrar
                </button>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

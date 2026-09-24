/* =========================================================
   SISTEMA DE GESTÃO
   Login + Solicitação de Cadastro
========================================================= */

"use strict";


/* =========================================================
   1. ELEMENTOS PRINCIPAIS
========================================================= */

const loginTab = document.getElementById("login-tab");

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

const goRegister = document.getElementById("go-register");
const goLogin = document.getElementById("go-login");

const formTitle = document.getElementById("form-title");
const formDescription = document.getElementById("form-description");

const message = document.getElementById("message");


/* =========================================================
   2. ELEMENTOS DO LOGIN
========================================================= */

const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");


/* =========================================================
   3. ELEMENTOS DO CADASTRO
========================================================= */

const nameInput = document.getElementById("name");
const registrationInput = document.getElementById("registration");
const corporateEmailInput = document.getElementById("corporate-email");
const whatsappInput = document.getElementById("whatsapp");
const positionInput = document.getElementById("position");
const departmentInput = document.getElementById("department");

const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");

const termsInput = document.getElementById("terms");


/* =========================================================
   4. INDICADORES DE SEGURANÇA DA SENHA
========================================================= */

const requireLength = document.getElementById("require-length");
const requireNumber = document.getElementById("require-number");
const requireUppercase = document.getElementById("require-uppercase");


/* =========================================================
   5. PRIMEIRO ACESSO À PÁGINA
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /*
        Sempre que a página for aberta,
        o usuário visualizará primeiro o LOGIN.
    */

    showLogin();

});


/* =========================================================
   6. MOSTRAR LOGIN
========================================================= */

function showLogin() {

    /* mostra login */

    if (loginForm) {
        loginForm.classList.add("active");
    }


    /* esconde cadastro */

    if (registerForm) {
        registerForm.classList.remove("active");
    }


    /* mostra identificação Entrar */

    if (loginTab) {
        loginTab.style.display = "block";
    }


    /* título */

    if (formTitle) {
        formTitle.textContent = "Bem-vindo";
    }


    /* descrição */

    if (formDescription) {

        formDescription.textContent =
            "Entre com seus dados corporativos para acessar o sistema.";

    }


    clearMessage();

}


/* =========================================================
   7. MOSTRAR CADASTRO
========================================================= */

function showRegister() {

    /* esconde login */

    if (loginForm) {
        loginForm.classList.remove("active");
    }


    /* mostra cadastro */

    if (registerForm) {
        registerForm.classList.add("active");
    }


    /* esconde a aba Entrar */

    if (loginTab) {
        loginTab.style.display = "none";
    }


    /* título */

    if (formTitle) {
        formTitle.textContent = "Criar conta";
    }


    /* descrição */

    if (formDescription) {

        formDescription.textContent =
            "Preencha todos os dados corporativos para solicitar acesso.";

    }


    clearMessage();

}


/* =========================================================
   8. BOTÕES DE NAVEGAÇÃO
========================================================= */

if (goRegister) {

    goRegister.addEventListener(
        "click",
        showRegister
    );

}


if (goLogin) {

    goLogin.addEventListener(
        "click",
        showLogin
    );

}


/* =========================================================
   9. LABELS ANIMADAS DOS INPUTS
========================================================= */

const allInputs = document.querySelectorAll(
    ".input-group input"
);


allInputs.forEach(function (input) {

    /*
        Placeholder vazio permite utilizar
        :placeholder-shown no CSS.
    */

    input.setAttribute(
        "placeholder",
        " "
    );


    input.addEventListener(
        "input",
        function () {

            if (input.value.trim() !== "") {

                input.classList.add(
                    "has-value"
                );

            } else {

                input.classList.remove(
                    "has-value"
                );

            }


            /*
                Quando o usuário começar
                a corrigir um campo com erro,
                removemos o destaque vermelho.
            */

            const group =
                input.closest(".input-group");


            if (group) {

                group.classList.remove(
                    "error"
                );

            }

        }
    );

});


/* =========================================================
   10. MOSTRAR / OCULTAR SENHAS
========================================================= */

const passwordButtons =
    document.querySelectorAll(
        ".password-toggle"
    );


passwordButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const targetId =
                    button.getAttribute(
                        "data-target"
                    );


                const input =
                    document.getElementById(
                        targetId
                    );


                if (!input) {
                    return;
                }


                if (
                    input.type ===
                    "password"
                ) {

                    input.type = "text";

                    button.textContent =
                        "Ocultar";

                    button.setAttribute(
                        "aria-label",
                        "Ocultar senha"
                    );

                } else {

                    input.type =
                        "password";

                    button.textContent =
                        "Mostrar";

                    button.setAttribute(
                        "aria-label",
                        "Mostrar senha"
                    );

                }

            }
        );

    }
);


/* =========================================================
   11. MÁSCARA DO WHATSAPP
========================================================= */

if (whatsappInput) {

    whatsappInput.addEventListener(
        "input",
        function (event) {

            /*
                Remove tudo que não for número.
            */

            let value =
                event.target.value.replace(
                    /\D/g,
                    ""
                );


            /*
                Limite brasileiro:
                DDD + 9 dígitos
            */

            value =
                value.substring(
                    0,
                    11
                );


            /*
                (81) 99999-9999
            */

            if (value.length > 10) {

                value =
                    value.replace(
                        /^(\d{2})(\d{5})(\d{4})$/,
                        "($1) $2-$3"
                    );

            }

            /*
                Telefone incompleto
            */

            else if (
                value.length > 6
            ) {

                value =
                    value.replace(
                        /^(\d{2})(\d{4})(\d{0,4})$/,
                        "($1) $2-$3"
                    );

            }

            else if (
                value.length > 2
            ) {

                value =
                    value.replace(
                        /^(\d{2})(\d+)/,
                        "($1) $2"
                    );

            }

            else if (
                value.length > 0
            ) {

                value =
                    value.replace(
                        /^(\d{0,2})/,
                        "($1"
                    );

            }


            event.target.value =
                value;

        }
    );

}


/* =========================================================
   12. VALIDAÇÃO VISUAL DA SENHA
========================================================= */

if (passwordInput) {

    passwordInput.addEventListener(
        "input",
        function () {

            const value =
                passwordInput.value;


            /* mínimo 8 caracteres */

            if (
                value.length >= 8
            ) {

                if (requireLength) {

                    requireLength.classList.add(
                        "valid"
                    );

                }

            } else {

                if (requireLength) {

                    requireLength.classList.remove(
                        "valid"
                    );

                }

            }


            /* pelo menos um número */

            if (
                /\d/.test(value)
            ) {

                if (requireNumber) {

                    requireNumber.classList.add(
                        "valid"
                    );

                }

            } else {

                if (requireNumber) {

                    requireNumber.classList.remove(
                        "valid"
                    );

                }

            }


            /* pelo menos uma maiúscula */

            if (
                /[A-Z]/.test(value)
            ) {

                if (requireUppercase) {

                    requireUppercase.classList.add(
                        "valid"
                    );

                }

            } else {

                if (requireUppercase) {

                    requireUppercase.classList.remove(
                        "valid"
                    );

                }

            }

        }
    );

}


/* =========================================================
   13. FUNÇÃO PARA EXIBIR MENSAGEM
========================================================= */

function showMessage(
    text,
    type
) {

    if (!message) {
        return;
    }


    message.textContent =
        text;


    message.className =
        `message ${type}`;

}


/* =========================================================
   14. LIMPAR MENSAGEM
========================================================= */

function clearMessage() {

    if (!message) {
        return;
    }


    message.textContent = "";

    message.className =
        "message";

}


/* =========================================================
   15. MARCAR CAMPO COM ERRO
========================================================= */

function markError(input) {

    if (!input) {
        return;
    }


    const group =
        input.closest(
            ".input-group"
        );


    if (group) {

        group.classList.add(
            "error"
        );

    }

}


/* =========================================================
   16. LIMPAR TODOS OS ERROS
========================================================= */

function clearErrors() {

    document
        .querySelectorAll(
            ".input-group"
        )
        .forEach(
            function (group) {

                group.classList.remove(
                    "error"
                );

            }
        );

}


/* =========================================================
   17. VALIDAR E-MAIL
========================================================= */

function validateEmail(email) {

    const regex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    return regex.test(
        email
    );

}


/* =========================================================
   18. VALIDAR SENHA
========================================================= */

function validatePassword(value) {

    const hasLength =
        value.length >= 8;


    const hasNumber =
        /\d/.test(value);


    const hasUppercase =
        /[A-Z]/.test(value);


    return (
        hasLength &&
        hasNumber &&
        hasUppercase
    );

}


/* =========================================================
   19. LOGIN
========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            /*
                Impede o formulário
                de recarregar a página.
            */

            event.preventDefault();


            clearMessage();

            clearErrors();


            /* =============================================
               VERIFICAR CAMPOS
            ============================================= */

            if (
                !loginEmail ||
                !loginEmail.value.trim()
            ) {

                markError(
                    loginEmail
                );


                showMessage(
                    "Informe seu e-mail corporativo.",
                    "error"
                );


                return;

            }


            if (
                !loginPassword ||
                !loginPassword.value
            ) {

                markError(
                    loginPassword
                );


                showMessage(
                    "Informe sua senha.",
                    "error"
                );


                return;

            }


            /* =============================================
               VALIDAR EMAIL
            ============================================= */

            if (
                !validateEmail(
                    loginEmail.value.trim()
                )
            ) {

                markError(
                    loginEmail
                );


                showMessage(
                    "Informe um e-mail corporativo válido.",
                    "error"
                );


                return;

            }


            /* =============================================
               LOGIN VALIDADO NO FRONT-END
            ============================================= */

            console.log(
                "Tentativa de login:",
                {
                    email:
                        loginEmail.value.trim()
                }
            );


            /*
                IMPORTANTE:

                Aqui NÃO validamos usuário e senha
                de verdade.

                Futuramente este ponto será
                conectado ao backend:

                Django
                Node
                PHP
                API REST
                etc.

                A senha nunca deve ser armazenada
                no localStorage.
            */


            showMessage(
                "Dados preenchidos corretamente. A autenticação será realizada pelo servidor.",
                "success"
            );

        }
    );

}


/* =========================================================
   20. CADASTRO
========================================================= */

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            clearMessage();

            clearErrors();


            /* =================================================
               TODOS OS CAMPOS SÃO OBRIGATÓRIOS
            ================================================= */

            const requiredFields = [

                nameInput,

                registrationInput,

                corporateEmailInput,

                whatsappInput,

                positionInput,

                departmentInput,

                passwordInput,

                confirmPasswordInput

            ];


            let formValid = true;

            let firstInvalidField = null;


            requiredFields.forEach(
                function (field) {

                    /*
                        Se por algum motivo
                        o campo não existir no HTML.
                    */

                    if (!field) {

                        formValid = false;

                        return;

                    }


                    /*
                        Campo vazio
                    */

                    if (
                        field.value.trim() === ""
                    ) {

                        formValid = false;

                        markError(
                            field
                        );


                        /*
                            Guarda o primeiro campo
                            com erro.
                        */

                        if (
                            !firstInvalidField
                        ) {

                            firstInvalidField =
                                field;

                        }

                    }

                }
            );


            /* =================================================
               BLOQUEAR SE ALGUM CAMPO ESTIVER VAZIO
            ================================================= */

            if (!formValid) {

                showMessage(
                    "Todos os campos são obrigatórios. Preencha as informações destacadas para continuar.",
                    "error"
                );


                /*
                    Leva o usuário para
                    o primeiro campo vazio.
                */

                if (
                    firstInvalidField
                ) {

                    firstInvalidField.focus();

                }


                return;

            }


            /* =================================================
               VALIDAR NOME
            ================================================= */

            if (
                nameInput.value
                    .trim()
                    .length < 3
            ) {

                markError(
                    nameInput
                );


                showMessage(
                    "Informe o nome completo do colaborador.",
                    "error"
                );


                nameInput.focus();


                return;

            }


            /* =================================================
               VALIDAR MATRÍCULA
            ================================================= */

            if (
                registrationInput.value
                    .trim()
                    .length < 2
            ) {

                markError(
                    registrationInput
                );


                showMessage(
                    "Informe uma matrícula válida.",
                    "error"
                );


                registrationInput.focus();


                return;

            }


            /* =================================================
               VALIDAR EMAIL CORPORATIVO
            ================================================= */

            const corporateEmail =
                corporateEmailInput
                    .value
                    .trim();


            if (
                !validateEmail(
                    corporateEmail
                )
            ) {

                markError(
                    corporateEmailInput
                );


                showMessage(
                    "Informe um e-mail corporativo válido.",
                    "error"
                );


                corporateEmailInput.focus();


                return;

            }


            /* =================================================
               VALIDAR WHATSAPP CORPORATIVO
            ================================================= */

            const phoneNumbers =
                whatsappInput
                    .value
                    .replace(
                        /\D/g,
                        ""
                    );


            /*
                Formato esperado:
                DDD + celular

                Exemplo:
                81999999999
            */

            if (
                phoneNumbers.length !== 11
            ) {

                markError(
                    whatsappInput
                );


                showMessage(
                    "Informe um WhatsApp corporativo válido com DDD.",
                    "error"
                );


                whatsappInput.focus();


                return;

            }


            /* =================================================
               VALIDAR CARGO
            ================================================= */

            if (
                positionInput.value
                    .trim()
                    .length < 2
            ) {

                markError(
                    positionInput
                );


                showMessage(
                    "Informe o cargo do colaborador.",
                    "error"
                );


                positionInput.focus();


                return;

            }


            /* =================================================
               VALIDAR SETOR
            ================================================= */

            if (
                departmentInput.value
                    .trim()
                    .length < 2
            ) {

                markError(
                    departmentInput
                );


                showMessage(
                    "Informe o setor do colaborador.",
                    "error"
                );


                departmentInput.focus();


                return;

            }


            /* =================================================
               VALIDAR SENHA
            ================================================= */

            if (
                !validatePassword(
                    passwordInput.value
                )
            ) {

                markError(
                    passwordInput
                );


                showMessage(
                    "A senha deve possuir no mínimo 8 caracteres, uma letra maiúscula e um número.",
                    "error"
                );


                passwordInput.focus();


                return;

            }


            /* =================================================
               CONFIRMAR SENHA
            ================================================= */

            if (
                passwordInput.value !==
                confirmPasswordInput.value
            ) {

                markError(
                    passwordInput
                );

                markError(
                    confirmPasswordInput
                );


                showMessage(
                    "As senhas informadas não são iguais.",
                    "error"
                );


                confirmPasswordInput.focus();


                return;

            }


            /* =================================================
               CHECKBOX OBRIGATÓRIO
            ================================================= */

            if (
                !termsInput ||
                !termsInput.checked
            ) {

                showMessage(
                    "Você precisa confirmar que os dados informados são corporativos e estão corretos.",
                    "error"
                );


                return;

            }


            /* =================================================
               DADOS VALIDADOS
            ================================================= */

            const userData = {

                nome:
                    nameInput
                        .value
                        .trim(),

                matricula:
                    registrationInput
                        .value
                        .trim(),

                email:
                    corporateEmail,

                whatsapp:
                    whatsappInput
                        .value
                        .trim(),

                cargo:
                    positionInput
                        .value
                        .trim(),

                setor:
                    departmentInput
                        .value
                        .trim()

            };


            /*
                Não incluímos a senha
                no console por segurança.
            */

            console.log(
                "Solicitação de cadastro:",
                userData
            );


            /* =================================================
               SUCESSO
            ================================================= */

            showMessage(
                "Solicitação enviada com sucesso! Seu cadastro está aguardando aprovação do administrador.",
                "success"
            );


            /*
                IMPORTANTE:

                Neste momento o cadastro
                ainda NÃO está sendo salvo.

                Quando tivermos backend,
                enviaremos userData + senha
                por HTTPS para o servidor.

                O servidor será responsável por:

                1. verificar matrícula duplicada;
                2. verificar e-mail duplicado;
                3. aplicar hash à senha;
                4. salvar o usuário;
                5. definir status PENDENTE;
                6. disponibilizar para aprovação
                   do administrador.
            */

        }
    );

}
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';
import { useToast } from '../context/ToastContext';

const questionsAndAnswers = [
  {
    question: 'O que é a plataforma?',
    answer:
      'É uma solução de monitoramento voltada para aplicações de e-commerce baseadas em microsserviços. Ela coleta, processa e apresenta métricas de CPU, memória e rede, permitindo acompanhar o comportamento dos serviços e identificar possíveis situações de sobrecarga.',
  },
  {
    question: 'Quais métricas podem ser monitoradas?',
    answer:
      'A plataforma monitora principalmente a utilização de CPU, memória e rede dos serviços. Essas métricas permitem acompanhar o consumo dos recursos computacionais e identificar alterações que possam indicar degradação de desempenho.',
  },
  {
    question: 'Como a plataforma identifica uma situação de sobrecarga?',
    answer:
      'O sistema utiliza parâmetros e limites previamente definidos para analisar as métricas coletadas. Quando os valores monitorados indicam uma condição crítica ou comportamento anormal, o serviço afetado é identificado e a situação pode ser apresentada como um alerta.',
  },
  {
    question: 'A plataforma monitora todos os microsserviços de uma aplicação?',
    answer:
      'A solução foi projetada para monitorar os serviços que forem configurados para participar do ambiente de monitoramento. Dessa forma, é possível acompanhar individualmente o comportamento dos diferentes componentes de uma aplicação baseada em microsserviços.',
  },
  {
    question: 'É possível acompanhar o histórico das métricas?',
    answer:
      'Sim. As métricas coletadas podem ser organizadas e apresentadas ao longo do tempo, permitindo analisar o comportamento dos recursos e comparar diferentes períodos de utilização.',
  },
  {
    question: 'A plataforma substitui ferramentas de observabilidade?',
    answer:
      'Não. A solução possui foco específico no monitoramento de recursos de infraestrutura, como CPU, memória e rede. Seu objetivo é fornecer uma visão centralizada desses indicadores e auxiliar na identificação de sobrecarga e degradação de desempenho.',
  },
  {
    question: 'Para quais situações a solução é mais indicada?',
    answer:
      'A solução é especialmente voltada para ambientes de e-commerce que utilizam microsserviços e enfrentam períodos de alta demanda, como Black Friday, Natal e outras campanhas promocionais. Nesses cenários, o monitoramento auxilia no acompanhamento da infraestrutura e na identificação de possíveis incidentes.',
  },
];

export default function LandingPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactLoading, setContactLoading] = useState(false);

  const { showToast } = useToast();

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  useEffect(() => {
    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
    }
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    const name = contactName.trim();
    const email = contactEmail.trim();
    const subject = contactSubject.trim();
    const message = contactMessage.trim();

    const nameRegex = /^[A-Za-zÀ-ÿ\s]{3,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(name)) {
      return showToast('Digite um nome válido (ao menos 3 letras)', 'warning');
    }
    if (!emailRegex.test(email)) {
      return showToast('Digite um e-mail válido', 'warning');
    }
    if (subject.length < 3) {
      return showToast('O assunto deve ter pelo menos 3 caracteres', 'warning');
    }
    if (message.length < 10) {
      return showToast('A mensagem deve ter pelo menos 10 caracteres', 'warning');
    }

    try {
      setContactLoading(true);
      const res = await fetch('/mailer/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      });

      const data = await res.json();

      if (res.status === 400) {
        return showToast(data.message || 'Dados inválidos', 'warning');
      }
      if (res.status !== 200) {
        return showToast(data.message || 'Erro ao enviar mensagem', 'error');
      }

      showToast(data.message || 'Mensagem enviada com sucesso! Entraremos em contato.', 'success');
      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactMessage('');
    } catch (err) {
      console.error(err);
      showToast('Algo deu errado. Tente novamente mais tarde.', 'error');
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-slate-950 text-slate-50 font-mono font-normal overflow-x-hidden antialiased">
      <div className="bg-noise"></div>

      <Header
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onOpenRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onOpenLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />

      <main className="flex flex-col items-center justify-center px-4 max-w-6xl mx-auto gap-44 pt-32">
        {/* HERO SECTION */}
        <section id="home" className="w-full min-h-[60dvh] flex flex-col items-center justify-end text-center gap-6 relative">
          <div className="w-xl h-40 bg-blue-800 absolute top-0 -left-56 blur-[8rem] rotate-45"></div>
          <div className="w-xl h-40 bg-indigo-800 absolute top-0 -right-56 blur-[8rem] -rotate-45"></div>
          <div className="flex flex-col items-center justify-center gap-3">
            <h1 className="text-5xl max-sm:text-3xl max-md:text-4xl max-w-4xl font-black bg-gradient-to-r from-blue-600 via-blue-400 to-indigo-600 bg-clip-text text-transparent animate-aurora-text bg-[length:200%_auto]">
              Visibilidade para sua infraestrutura nos momentos que mais importam.
            </h1>
            <p className="text-slate-200 max-w-5xl max-sm:text-sm">
              Monitore CPU, memória e rede dos seus microsserviços em um único dashboard e identifique rapidamente sinais de
              sobrecarga e degradação de desempenho.
            </p>
          </div>
          <a href="#problem">
            <button className="cursor-pointer min-w-32 py-2 px-6 bg-blue-500 shadow-lg shadow-blue-500 rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              Conheça a solução
            </button>
          </a>
        </section>

        {/* PROBLEM SECTION */}
        <section id="problem" className="w-full flex flex-col items-center justify-center relative gap-3">
          <div className="w-2xl max-sm:w-full h-16 bg-gradient-to-b from-blue-800 via-indigo-700 to-indigo-800 absolute -top-5 blur-3xl"></div>
          <div className="w-full flex max-sm:flex-col gap-6 bg-gradient-to-br from-slate-700/90 via-blue-800/90 to-indigo-800/90 rounded-2xl transition-all duration-300 hover:scale-[1.01]">
            <div className="flex flex-col gap-7 p-8 w-1/2 max-sm:w-full max-md:w-2/3">
              <div className="size-12 bg-indigo-600 rounded-md flex justify-center items-center">
                <i className="ph ph-arrows-in text-4xl"></i>
              </div>
              <h2 className="text-2xl max-sm:text-xl font-semibold">
                Mais acessos. Mais serviços. Mais complexidade.
              </h2>
              <div className="flex flex-col gap-3 max-sm:text-sm">
                <p>
                  Eventos como Black Friday, Natal e Dia das Mães podem provocar aumentos repentinos no tráfego de um e-commerce.
                </p>
                <p>
                  Em ambientes baseados em microsserviços, esse crescimento pode elevar o consumo de recursos e aumentar a
                  dependência entre diferentes componentes da aplicação.
                </p>
                <p>
                  Sem visibilidade adequada, identificar a origem de uma degradação pode se tornar tão complexo quanto o próprio ambiente.
                </p>
              </div>
            </div>
            <div className="w-1/2 max-sm:w-full max-md:w-1/3 flex items-center justify-end overflow-hidden">
              <img
                className="rounded-l-2xl max-h-68 max-sm:rounded-2xl shadow-2xl shadow-slate-900/50 max-sm:mx-auto bg-indigo-950/50"
                src="/assets/img/landing-page/overloaded-server.svg"
                width="500"
                height="300"
                alt="Servidor sobrecarregado"
              />
            </div>
          </div>
          <div className="w-full flex max-md:flex-col gap-3 items-stretch">
            <div className="w-full bg-slate-800 rounded-2xl p-8 transition-all duration-300 border-2 border-transparent hover:border-blue-600 hover:scale-102">
              <h3 className="font-bold text-5xl max-sm:text-3xl text-blue-400">83,7%</h3>
              <p className="mt-2 text-slate-300">dos e-commerces analisados apresentaram instabilidade durante as primeiras horas da Black Friday.</p>
            </div>
            <div className="w-full bg-slate-800 rounded-2xl p-8 transition-all duration-300 border-2 border-transparent hover:border-blue-600 hover:scale-102">
              <h3 className="font-bold text-5xl max-sm:text-3xl text-amber-400">32%</h3>
              <p className="mt-2 text-slate-300">enfrentaram problemas relacionados a timeout.</p>
            </div>
            <div className="w-full bg-slate-800 rounded-2xl p-8 transition-all duration-300 border-2 border-transparent hover:border-blue-600 hover:scale-102">
              <h3 className="font-bold text-5xl max-sm:text-3xl text-rose-400">R$6,4</h3>
              <p className="mt-2 text-slate-300">milhões em prejuízos estimados em apenas algumas horas durante o período analisado.</p>
            </div>
          </div>
        </section>

        {/* SOLUTION SECTION */}
        <section id="solution" className="flex flex-col items-center justify-center w-full">
          <h2 className="text-4xl max-sm:text-2xl max-w-3xl font-semibold text-center mb-20">
            Uma visão centralizada da saúde dos seus microsserviços.
          </h2>
          <div className="flex max-md:flex-col w-full gap-4">
            <div className="w-2/3 max-md:w-full bg-slate-800 rounded-2xl flex flex-col gap-4 p-8 overflow-hidden transition-all duration-300 border-2 border-transparent hover:border-blue-600 hover:scale-102">
              <div className="size-12 bg-blue-600 rounded-md flex justify-center items-center relative">
                <div className="size-20 bg-blue-600 rounded-md absolute z-10 blur-2xl"></div>
                <i className="ph ph-lightbulb text-4xl z-20"></i>
              </div>
              <div className="flex flex-col gap-3 text-lg max-sm:text-base">
                <p>
                  Nossa solução coleta, processa e apresenta métricas de infraestrutura dos serviços monitorados em uma única interface.
                </p>
                <p>
                  A plataforma transforma dados técnicos em indicadores visuais que permitem acompanhar o comportamento dos recursos,
                  reconhecer padrões anormais e identificar serviços que apresentam sinais de sobrecarga.
                </p>
              </div>
            </div>
            <div className="w-1/3 max-md:w-full bg-slate-800 rounded-2xl flex flex-col p-8 relative overflow-hidden transition-all duration-300 border-2 border-transparent hover:border-indigo-600 hover:scale-102">
              <div className="size-20 bg-indigo-600/50 rounded-md absolute z-10 blur-3xl bottom-0 right-0"></div>
              <img src="/assets/img/landing-page/diagram.svg" className="max-md:max-w-sm mx-auto" alt="Diagrama de Processamento" />
            </div>
          </div>

          <div className="flex max-md:flex-col w-full gap-4 mt-4">
            <div className="w-5/12 max-md:w-full bg-gradient-to-br from-slate-700/90 via-blue-800/90 to-indigo-800/90 rounded-2xl flex flex-col p-8 pb-0 justify-between gap-4 transition-all duration-300 hover:scale-[1.01]">
              <div className="size-12 bg-slate-800 rounded-md flex justify-center items-center">
                <i className="ph ph-target text-4xl z-20"></i>
              </div>
              <div className="flex flex-col md:gap-8 gap-2.5 text-lg">
                <h3 className="text-2xl max-sm:text-xl font-medium">Tudo o que você precisa acompanhar em um único lugar.</h3>
                <p className="pb-3 max-sm:text-sm text-slate-200">
                  Acompanhe o comportamento dos serviços ao longo do tempo e tenha uma visão consolidada da infraestrutura durante
                  operações normais ou períodos de alta demanda.
                </p>
              </div>
              <img className="bg-blue-900 rounded-t-2xl max-w-72 mx-auto" src="/assets/img/landing-page/controll-server.svg" alt="Servidor" />
            </div>

            <div className="w-7/12 max-md:w-full flex flex-col gap-4">
              <div className="w-full bg-slate-800 rounded-2xl p-8 transition-all duration-300 border-2 border-transparent hover:border-indigo-600 hover:scale-102">
                <div className="flex gap-3 items-center">
                  <div className="size-12 bg-indigo-600 rounded-md flex justify-center items-center">
                    <i className="ph ph-cpu text-4xl z-20"></i>
                  </div>
                  <h3 className="font-medium text-3xl max-sm:text-2xl">CPU</h3>
                </div>
                <p className="mt-4 text-lg max-sm:text-base text-slate-300">
                  Acompanhe a utilização dos recursos de processamento e identifique serviços próximos de situações de sobrecarga.
                </p>
              </div>

              <div className="w-full bg-slate-800 rounded-2xl p-8 transition-all duration-300 border-2 border-transparent hover:border-indigo-600 hover:scale-102">
                <div className="flex gap-3 items-center">
                  <div className="size-12 bg-indigo-600 rounded-md flex justify-center items-center">
                    <i className="ph ph-memory text-4xl z-20"></i>
                  </div>
                  <h3 className="font-medium text-3xl max-sm:text-2xl">Memória</h3>
                </div>
                <p className="mt-4 text-lg max-sm:text-base text-slate-300">
                  Monitore o consumo de memória e reconheça comportamentos que possam indicar degradação.
                </p>
              </div>

              <div className="w-full bg-slate-800 rounded-2xl p-8 transition-all duration-300 border-2 border-transparent hover:border-indigo-600 hover:scale-102">
                <div className="flex gap-3 items-center">
                  <div className="size-12 bg-indigo-600 rounded-md flex justify-center items-center">
                    <i className="ph ph-network text-4xl z-20"></i>
                  </div>
                  <h3 className="font-medium text-3xl max-sm:text-2xl">Rede</h3>
                </div>
                <p className="mt-4 text-lg max-sm:text-base text-slate-300">
                  Visualize o tráfego de entrada e saída dos serviços e identifique alterações no comportamento da comunicação.
                </p>
              </div>

              <div className="w-full bg-slate-800 rounded-2xl p-8 transition-all duration-300 border-2 border-transparent hover:border-indigo-600 hover:scale-102">
                <div className="flex gap-3 items-center">
                  <div className="size-12 bg-indigo-600 rounded-md flex justify-center items-center">
                    <i className="ph ph-disc text-4xl z-20"></i>
                  </div>
                  <h3 className="font-medium text-3xl">Disco</h3>
                </div>
                <p className="mt-4 text-lg text-slate-300">
                  Monitore a capacidade e a velocidade de leitura e escrita das unidades de armazenamento dos serviços.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="flex flex-col items-center justify-center w-full gap-4">
          <h2 className="text-4xl max-sm:text-2xl max-w-lg font-semibold text-center mb-12">
            Perguntas Frequentes (FAQ)
          </h2>

          {questionsAndAnswers.map((item, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="flex items-center justify-center w-full transition-all duration-300">
                <div
                  onClick={() => toggleFaq(index)}
                  className={`flex flex-col items-center justify-center gap-3 w-full bg-slate-800 rounded-2xl px-6 py-4 max-w-3xl cursor-pointer border transition-all duration-300 ${
                    isOpen ? 'border-blue-500 scale-102 shadow-lg shadow-blue-500/10' : 'border-transparent hover:scale-102'
                  }`}
                >
                  <div className="flex justify-start items-center gap-4 w-full">
                    <button className="flex justify-center cursor-pointer text-slate-300">
                      <i className={`ph ${isOpen ? 'ph-caret-up text-blue-400' : 'ph-caret-down'} text-3xl`}></i>
                    </button>
                    <h3 className="text-xl max-sm:text-base font-normal flex-1">
                      {item.question}
                    </h3>
                  </div>
                  {isOpen && (
                    <div className="flex w-full max-sm:text-sm pt-2 text-slate-300 border-t border-slate-700/60 mt-1">
                      <p className="flex items-start gap-2">
                        <i className="ph ph-arrow-bend-down-right text-xl text-blue-400 shrink-0 mt-0.5"></i>
                        <span>{item.answer}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </section>

        {/* CONTACT US SECTION */}
        <section id="contact-us" className="flex flex-col items-center justify-center w-full gap-8">
          <div className="flex flex-col gap-1 items-center justify-center text-center relative">
            <div className="w-lg h-60 bg-gradient-to-t from-blue-600 via-blue-700 to-indigo-800 absolute -bottom-60 blur-[8rem] -z-10"></div>
            <h2 className="text-4xl max-sm:text-2xl max-w-lg font-semibold text-center">Entre em contato</h2>
            <p className="max-w-lg max-sm:text-sm text-slate-200">
              Se você tem alguma dúvida ou deseja mais informações sobre nossos serviços, entre em contato conosco. Estamos aqui para ajudar!
            </p>
          </div>
          <form
            id="contactForm"
            onSubmit={handleContactSubmit}
            className="bg-slate-800/90 w-full max-w-xl flex flex-col items-center p-12 max-sm:p-6 rounded-2xl gap-4 backdrop-blur-2xl relative overflow-hidden border border-slate-700/60 shadow-2xl"
          >
            <div className="w-52 h-60 bg-blue-600 absolute top-0 -left-56 blur-[8rem] rotate-45 -z-10"></div>
            <div className="w-52 h-60 bg-indigo-700 absolute top-0 -right-56 blur-[8rem] rotate-45 -z-10"></div>
            <input
              type="text"
              id="contactName"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Nome"
              className="px-4 py-3 bg-slate-900/90 backdrop-blur-2xl rounded-lg placeholder:text-slate-500 w-full border border-slate-700 focus:border-blue-500 outline-none text-slate-100 transition-colors"
              required
            />
            <input
              type="email"
              id="contactEmail"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="E-mail"
              className="px-4 py-3 bg-slate-900/90 backdrop-blur-2xl rounded-lg placeholder:text-slate-500 w-full border border-slate-700 focus:border-blue-500 outline-none text-slate-100 transition-colors"
              required
            />
            <input
              type="text"
              id="contactSubject"
              value={contactSubject}
              onChange={(e) => setContactSubject(e.target.value)}
              placeholder="Assunto"
              className="px-4 py-3 bg-slate-900/90 backdrop-blur-2xl rounded-lg placeholder:text-slate-500 w-full border border-slate-700 focus:border-blue-500 outline-none text-slate-100 transition-colors"
              required
            />
            <textarea
              id="contactMessage"
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              placeholder="Mensagem"
              className="px-4 py-3 bg-slate-900/90 backdrop-blur-2xl rounded-lg placeholder:text-slate-500 w-full resize-none min-h-32 border border-slate-700 focus:border-blue-500 outline-none text-slate-100 transition-colors"
              required
            ></textarea>
            <button
              type="submit"
              id="contactSendButton"
              disabled={contactLoading}
              className="cursor-pointer flex items-center justify-center gap-2 border border-blue-500 hover:bg-blue-600 w-full rounded-full px-4 py-3 mt-4 backdrop-blur-2xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 disabled:opacity-50 transition-all font-medium"
            >
              {contactLoading ? (
                <>
                  <i className="ph ph-spinner text-xl animate-spin"></i>
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <i className="ph ph-paper-plane-tilt text-xl"></i>
                  <span>Enviar mensagem</span>
                </>
              )}
            </button>
          </form>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-40 w-full bg-slate-950/80 border-t border-slate-800 py-12 px-8 relative overflow-hidden">
        <div className="w-lg h-32 bg-blue-700 absolute left-1/2 -translate-x-1/2 -bottom-32 blur-[8rem] -z-10"></div>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col gap-5 md:col-span-2">
              <div className="flex items-center gap-3">
                <img src="/assets/img/logo/logo-light.svg" alt="Logo da Microhub" className="h-8 w-auto" />
              </div>
              <p className="text-slate-400 text-sm max-w-sm">
                Plataforma brasileira de monitoramento de microsserviços para e-commerce. Confiança, performance e escala para qualquer
                operação.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">Navegação</h3>
              <nav className="flex flex-col gap-3">
                <a href="#home" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                  Início
                </a>
                <a href="#solution" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                  Solução
                </a>
                <a href="#faq" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                  FAQ
                </a>
                <a href="#contact-us" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                  Contate-nos
                </a>
              </nav>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">Acesso</h3>
              <nav className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setIsLoginOpen(true)}
                  className="text-left text-sm text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(true)}
                  className="text-left text-sm text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Cadastrar Usuário
                </button>
                <Link
                  to="/company-register"
                  className="text-left text-sm text-slate-400 hover:text-blue-400 transition-colors"
                >
                  Cadastrar Empresa
                </Link>
              </nav>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-10 pt-6 text-center text-xs text-slate-500">
            &copy; 2026 Microhub. Desenvolvido para São Paulo Tech School (SPTech).
          </div>
        </div>
      </footer>
    </div>
  );
}

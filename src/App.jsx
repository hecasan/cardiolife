import { useState, useEffect } from 'react'
import './App.css'

// Banco de dados mockado de usuários
const usuariosMock = [
  {
    id: 1,
    nome: 'Dr. João Silva',
    email: 'joao@cardiolife.com',
    senha: '123456',
    tipo: 'médico'
  },
  {
    id: 2,
    nome: 'Dra. Maria Santos',
    email: 'maria@cardiolife.com',
    senha: '123456',
    tipo: 'médica'
  },
  {
    id: 3,
    nome: 'Admin Sistema',
    email: 'admin@cardiolife.com',
    senha: 'admin123',
    tipo: 'administrador'
  }
]

function App() {
  // Estados do formulário cardiológico (já existentes)
  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    peso: '',
    pressaoSistolica: '',
    pressaoDiastolica: ''
  })

  const [savedData, setSavedData] = useState([])

  // Estados de autenticação (NOVOS)
  const [usuarioLogado, setUsuarioLogado] = useState(null)
  const [loginData, setLoginData] = useState({
    email: '',
    senha: ''
  })
  const [erroLogin, setErroLogin] = useState('')

  // Carregar dados do localStorage ao inicializar
  useEffect(() => {
    // Verificar se existe sessão salva
    const sessaoSalva = localStorage.getItem('sessaoCardioLife')
    if (sessaoSalva) {
      const dadosSessao = JSON.parse(sessaoSalva)
      setUsuarioLogado(dadosSessao)
    }

    // Carregar dados cardiológicos
    const dadosSalvos = localStorage.getItem('dadosCardiologicos')
    if (dadosSalvos) {
      setSavedData(JSON.parse(dadosSalvos))
    }
  }, [])

  // Função para manipular login
  const handleLogin = (e) => {
    e.preventDefault()
    setErroLogin('') // Limpa erros anteriores

    // Validar campos vazios
    if (!loginData.email || !loginData.senha) {
      setErroLogin('Por favor, preencha todos os campos')
      return
    }

    // Buscar usuário no banco mockado
    const usuarioEncontrado = usuariosMock.find(
      usuario => usuario.email === loginData.email && usuario.senha === loginData.senha
    )

    // Verificar se encontrou
    if (usuarioEncontrado) {
      // Dados que serão salvos (sem a senha por segurança)
      const dadosUsuario = {
        id: usuarioEncontrado.id,
        nome: usuarioEncontrado.nome,
        email: usuarioEncontrado.email,
        tipo: usuarioEncontrado.tipo
      }

      // Salvar sessão no localStorage
      localStorage.setItem('sessaoCardioLife', JSON.stringify(dadosUsuario))
      setUsuarioLogado(dadosUsuario)
      
      // Limpar formulário
      setLoginData({ email: '', senha: '' })
    } else {
      setErroLogin('Email ou senha incorretos')
    }
  }

  // Função para logout
  const handleLogout = () => {
    localStorage.removeItem('sessaoCardioLife')
    setUsuarioLogado(null)
    alert('Logout realizado com sucesso!')
  }

  // Função para manipular inputs do login
  const handleLoginInputChange = (e) => {
    const { name, value } = e.target
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpa erro quando usuário começa a digitar
    if (erroLogin) setErroLogin('')
  }

  // Função para manipular inputs do formulário cardiológico
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validações básicas
    if (!formData.nome || !formData.idade || !formData.peso || 
        !formData.pressaoSistolica || !formData.pressaoDiastolica) {
      alert('Por favor, preencha todos os campos!')
      return
    }

    if (isNaN(formData.idade) || isNaN(formData.peso) || 
        isNaN(formData.pressaoSistolica) || isNaN(formData.pressaoDiastolica)) {
      alert('Idade, peso e pressão devem ser números válidos!')
      return
    }

    // Criar novo registro com timestamp
    const novoRegistro = {
      ...formData,
      id: Date.now(),
      dataRegistro: new Date().toLocaleString('pt-BR')
    }

    // Salvar no localStorage
    const dadosAtualizados = [...savedData, novoRegistro]
    localStorage.setItem('dadosCardiologicos', JSON.stringify(dadosAtualizados))
    setSavedData(dadosAtualizados)

    // Limpar formulário
    setFormData({
      nome: '',
      idade: '',
      peso: '',
      pressaoSistolica: '',
      pressaoDiastolica: ''
    })

    alert('Dados salvos com sucesso!')
  }

  return (
    <div className="app">
      <header className="header">
        <h1>CardioLife</h1>
        <p>Sistema de Monitoramento Cardiológico</p>
      </header>

      {!usuarioLogado ? (
        // TELA DE LOGIN
        <div className="login-container">
          <div className="login-box">
            <div className="login-header">
              <div className="login-icon">🔐</div>
              <h2>Acesso ao Sistema</h2>
              <p>Entre com suas credenciais</p>
            </div>

            <form onSubmit={handleLogin} className="login-form">
              {erroLogin && (
                <div className="error-message">
                  ⚠️ {erroLogin}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">E-mail:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginInputChange}
                  placeholder="seu@email.com"
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="senha">Senha:</label>
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  value={loginData.senha}
                  onChange={handleLoginInputChange}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                />
              </div>

              <button type="submit" className="login-btn">
                Entrar no Sistema
              </button>
            </form>

            <div className="login-info">
              <p><strong>👨‍⚕️ Usuários de teste:</strong></p>
              <p>📧 joao@cardiolife.com / 🔑 123456</p>
              <p>📧 maria@cardiolife.com / 🔑 123456</p>
              <p>📧 admin@cardiolife.com / 🔑 admin123</p>
            </div>
          </div>
        </div>
      ) : (
        // SISTEMA PRINCIPAL (após login)
        <>
          <div className="user-info">
            <div className="user-details">
              <span className="user-icon">👤</span>
              <div>
                <strong>{usuarioLogado.nome}</strong>
                <span className="user-type"> • {usuarioLogado.tipo}</span>
              </div>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              🚪 Sair
            </button>
          </div>

          <main className="main-content">
            <div className="form-container">
              <h2>Cadastro de Dados Cardiológicos</h2>
              
              <form onSubmit={handleSubmit} className="medical-form">
                <div className="form-group">
                  <label htmlFor="nome">Nome Completo:</label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Digite seu nome completo"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="idade">Idade:</label>
                    <input
                      type="number"
                      id="idade"
                      name="idade"
                      value={formData.idade}
                      onChange={handleInputChange}
                      placeholder="Anos"
                      min="1"
                      max="120"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="peso">Peso (kg):</label>
                    <input
                      type="number"
                      id="peso"
                      name="peso"
                      value={formData.peso}
                      onChange={handleInputChange}
                      placeholder="Ex: 70.5"
                      step="0.1"
                      min="1"
                      max="300"
                      required
                    />
                  </div>
                </div>

                <div className="form-group pressure-group">
                  <label>Pressão Arterial (mmHg):</label>
                  <div className="pressure-inputs">
                    <div className="pressure-field">
                      <label htmlFor="pressaoSistolica">Sistólica:</label>
                      <input
                        type="number"
                        id="pressaoSistolica"
                        name="pressaoSistolica"
                        value={formData.pressaoSistolica}
                        onChange={handleInputChange}
                        placeholder="120"
                        min="60"
                        max="250"
                        required
                      />
                    </div>
                    <span className="pressure-separator">/</span>
                    <div className="pressure-field">
                      <label htmlFor="pressaoDiastolica">Diastólica:</label>
                      <input
                        type="number"
                        id="pressaoDiastolica"
                        name="pressaoDiastolica"
                        value={formData.pressaoDiastolica}
                        onChange={handleInputChange}
                        placeholder="80"
                        min="40"
                        max="150"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="submit-btn">
                  Salvar Dados Cardiológicos
                </button>
              </form>
            </div>

            {savedData.length > 0 && (
              <div className="data-container">
                <h3>Registros Salvos ({savedData.length})</h3>
                <div className="records-list">
                  {savedData.slice(-3).reverse().map((registro) => (
                    <div key={registro.id} className="record-card">
                      <h4>{registro.nome}</h4>
                      <p><strong>Idade:</strong> {registro.idade} anos</p>
                      <p><strong>Peso:</strong> {registro.peso} kg</p>
                      <p><strong>Pressão:</strong> {registro.pressaoSistolica}/{registro.pressaoDiastolica} mmHg</p>
                      <p className="record-date">{registro.dataRegistro}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </>
      )}
    </div>
  )
}

export default App

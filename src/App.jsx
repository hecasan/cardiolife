import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    peso: '',
    pressaoSistolica: '',
    pressaoDiastolica: ''
  })

  const [savedData, setSavedData] = useState([])

  // Carregar dados do localStorage ao inicializar
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('dadosCardiologicos')
    if (dadosSalvos) {
      setSavedData(JSON.parse(dadosSalvos))
    }
  }, [])

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
    </div>
  )
}

export default App

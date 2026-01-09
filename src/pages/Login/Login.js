import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import './Login.css';

export default function Login() {
  const { login } = useApp();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = () => {
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    const success = login(formData.email, formData.password);
    
    if (!success) {
      setError('E-mail ou senha incorretos.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">Sistema de Otimização de Rotas</h1>
          <p className="login-subtitle">Faça login para continuar</p>
        </div>

        <div className="login-form-container">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="label">E-mail:</label>
            <input
              type="email"
              name="email"
              className="input"
              placeholder="Digite seu e-mail"
              value={formData.email}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
          </div>

          <div className="form-group">
            <label className="label">Senha:</label>
            <input
              type="password"
              name="password"
              className="input"
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Lembrar-me</span>
            </label>
            <a href="#forgot" className="link">Esqueci minha senha</a>
          </div>

          <button className="btn-primary btn-full" onClick={handleSubmit}>
            Entrar
          </button>

          <div className="divider">
            <span>ou</span>
          </div>

          <p className="register-text">
            Não tem uma conta? <a href="#register" className="link">Cadastre-se</a>
          </p>
        </div>

        <footer className="login-footer">
          <p>© 2025 Sistema de Otimização de Rotas</p>
        </footer>
      </div>
    </div>
  );
}
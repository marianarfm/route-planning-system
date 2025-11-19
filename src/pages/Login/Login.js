import React, { useState } from 'react';
import './Login.css';

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">Sistema de Otimização de Rotas</h1>
          <p className="login-subtitle">Faça login para continuar</p>
        </div>

        <div className="login-form-container">
          <div className="form-group">
            <label className="label">E-mail:</label>
            <input
              type="email"
              className="input"
              placeholder="Digite seu e-mail"
            />
          </div>

          <div className="form-group">
            <label className="label">Senha:</label>
            <input
              type="password"
              className="input"
              placeholder="Digite sua senha"
            />
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Lembrar-me</span>
            </label>
            <a href="#forgot" className="link">Esqueci minha senha</a>
          </div>

          <button className="btn-primary btn-full" onClick={() => {onLogin(formData.email, formData.password);}}>Entrar</button>

          <div className="divider">
            <span>ou</span>
          </div>

          <p className="register-text">
            Não tem uma conta? <a href="#register" className="link">Cadastre-se</a>
          </p>
        </div>

        <footer className="login-footer">
          <p>© 2025 Sistema de Otimização de Rotas. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect, useRef } from "react";

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface Company {
  id: number;
  name: string;
  domain?: string;
  is_active: boolean;
}

interface Customer {
  id: number;
  name?: string;
  external_id: string;
}

interface CustomerProfileData {
  name?: string;
  age?: number;
  location?: string;
  occupation?: string;
  budget_range?: string;
  family_status?: string;
  total_conversations?: number;
  total_messages?: number;
  conversion_stage?: string;
  interests?: string[];
  notes?: string;
}

interface Message {
  id: number;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
  handoff?: boolean;
  handoffReason?: string;
  tone?: string;
  executionPath?: string[];
  status?: string;
  quality?: string;
  isError?: boolean;
}

interface StatsData {
  totalMessages?: number;
  handoffs?: number;
  conversations?: number;
}

interface ProductForm {
  id: string;
  name: string;
  summary: string;
  base_price: string;
  addons: string;
}

/* ─── Scoped CSS ─────────────────────────────────────────────────────────── */
const SCOPED_CSS = `
.sba-root {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  direction: rtl;
  color: #333;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.sba-root .app {
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.sba-root .app-container {
  display: flex;
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px;
  gap: 16px;
  min-height: 0;
}
.sba-root .header {
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
  padding: 14px 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,.1);
  border-bottom: 1px solid rgba(255,255,255,.2);
  flex-shrink: 0;
}
.sba-root .header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sba-root .logo {
  display: flex;
  align-items: center;
  gap: 12px;
}
.sba-root .logo-icon {
  font-size: 2rem;
  background: linear-gradient(45deg,#667eea,#764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.sba-root .logo-text h1 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}
.sba-root .logo-text p {
  color: #718096;
  font-size: 0.8rem;
  margin: 0;
}
.sba-root .status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: rgba(72,187,120,.1);
  border: 1px solid rgba(72,187,120,.3);
  border-radius: 20px;
  color: #38a169;
  font-size: 0.85rem;
  font-weight: 500;
}
.sba-root .status-dot {
  width: 8px;
  height: 8px;
  background: #48bb78;
  border-radius: 50%;
  animation: sba-pulse 2s infinite;
}
@keyframes sba-pulse {
  0%,100% { opacity:1; }
  50%      { opacity:.5; }
}
.sba-root .sidebar {
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}
.sba-root .sidebar-card {
  background: rgba(255,255,255,.95);
  backdrop-filter: blur(10px);
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,.1);
  border: 1px solid rgba(255,255,255,.2);
}
.sba-root .sidebar-card h3 {
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.sba-root .main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  min-width: 0;
}
.sba-root .chat-container {
  background: rgba(255,255,255,.95);
  backdrop-filter: blur(10px);
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,.1);
  border: 1px solid rgba(255,255,255,.2);
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.sba-root .chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f7fafc;
  flex-shrink: 0;
}
.sba-root .chat-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 600;
}
.sba-root .chat-icon { font-size: 1.3rem; color: #667eea; }
.sba-root .message-count-badge {
  background: linear-gradient(45deg,#667eea,#764ba2);
  color: white;
  padding: 3px 7px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
}
.sba-root .connection-status {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 7px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 500;
}
.sba-root .connection-status.connected {
  background: rgba(72,187,120,.1);
  color: #38a169;
  border: 1px solid rgba(72,187,120,.3);
}
.sba-root .connection-status.disconnected {
  background: rgba(245,101,101,.1);
  color: #e53e3e;
  border: 1px solid rgba(245,101,101,.3);
}
.sba-root .connection-status .status-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: currentColor;
}
.sba-root .chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
}
.sba-root .message {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  animation: sba-slideIn .3s ease-out;
}
@keyframes sba-slideIn {
  from { opacity:0; transform:translateY(8px); }
  to   { opacity:1; transform:translateY(0); }
}
.sba-root .message.user { flex-direction: row-reverse; }
.sba-root .message-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.9rem; font-weight: 600; flex-shrink: 0;
}
.sba-root .message.user .message-avatar {
  background: linear-gradient(45deg,#667eea,#764ba2); color: white;
}
.sba-root .message.bot .message-avatar {
  background: linear-gradient(45deg,#48bb78,#38a169); color: white;
}
.sba-root .message-content {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 0.9rem;
  line-height: 1.4;
  word-wrap: break-word;
}
.sba-root .message.user .message-content {
  background: linear-gradient(45deg,#667eea,#764ba2);
  color: white;
  border-bottom-right-radius: 4px;
}
.sba-root .message.bot .message-content {
  background: #f7fafc;
  color: #2d3748;
  border: 1px solid #e2e8f0;
  border-bottom-left-radius: 4px;
}
.sba-root .chat-input {
  display: flex;
  gap: 10px;
  padding-top: 12px;
  border-top: 2px solid #f7fafc;
  flex-shrink: 0;
}
.sba-root .chat-input input {
  flex: 1;
  padding: 10px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 22px;
  font-size: 0.9rem;
  outline: none;
  transition: all .2s ease;
  background: white;
  font-family: inherit;
}
.sba-root .chat-input input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102,126,234,.1);
}
.sba-root .send-button {
  padding: 10px 16px;
  background: linear-gradient(45deg,#667eea,#764ba2);
  color: white;
  border: none;
  border-radius: 22px;
  font-weight: 600;
  cursor: pointer;
  transition: all .3s ease;
  display: flex; align-items: center; gap: 6px;
  font-size: 0.85rem;
  white-space: nowrap;
}
.sba-root .send-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102,126,234,.3);
}
.sba-root .send-button:disabled { opacity:.6; cursor:not-allowed; transform:none; }
.sba-root .stats-panel {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 12px;
  flex-shrink: 0;
}
.sba-root .stat-card {
  background: rgba(255,255,255,.95);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 14px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0,0,0,.1);
  border: 1px solid rgba(255,255,255,.2);
}
.sba-root .stat-number {
  font-size: 1.6rem; font-weight: 700;
  background: linear-gradient(45deg,#667eea,#764ba2);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  margin-bottom: 2px;
}
.sba-root .stat-label { color: #718096; font-size: 0.8rem; font-weight: 500; }
.sba-root .form-group { margin-bottom: 14px; }
.sba-root .form-label { display: block; margin-bottom: 5px; color: #2d3748; font-weight: 500; font-size: 0.85rem; }
.sba-root .form-input,
.sba-root .form-select {
  width: 100%; padding: 9px 11px;
  border: 2px solid #e2e8f0; border-radius: 8px;
  font-size: 0.85rem; outline: none; transition: all .2s ease;
  background: white; font-family: inherit;
}
.sba-root .form-input:focus,
.sba-root .form-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102,126,234,.1);
}
.sba-root .btn {
  padding: 9px 15px; border: none; border-radius: 8px;
  font-weight: 600; font-size: 0.85rem; cursor: pointer;
  transition: all .2s ease; display: inline-flex; align-items: center;
  gap: 6px; font-family: inherit;
}
.sba-root .btn-primary { background: linear-gradient(45deg,#667eea,#764ba2); color: white; }
.sba-root .btn-primary:hover { transform:translateY(-1px); box-shadow:0 4px 12px rgba(102,126,234,.3); }
.sba-root .btn-secondary { background:#f7fafc; color:#4a5568; border:2px solid #e2e8f0; }
.sba-root .btn-secondary:hover { background:#edf2f7; }
.sba-root .btn-success { background: linear-gradient(45deg,#48bb78,#38a169); color:white; }
.sba-root .btn-success:hover { transform:translateY(-1px); box-shadow:0 4px 12px rgba(72,187,120,.3); }
.sba-root .btn:disabled { opacity:.6; cursor:not-allowed; transform:none; }
.sba-root .modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.65);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 200; animation: sba-fadeIn .2s ease;
}
@keyframes sba-fadeIn { from{opacity:0;} to{opacity:1;} }
.sba-root .modal-content {
  background: white; border-radius: 14px; padding: 28px;
  max-width: 580px; width: 90%; max-height: 85vh; overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,.3); animation: sba-slideUp .3s ease;
}
.sba-root .large-modal { max-width: 860px; }
@keyframes sba-slideUp {
  from { opacity:0; transform:translateY(16px); }
  to   { opacity:1; transform:translateY(0); }
}
.sba-root .modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 0 16px; border-bottom: 1px solid #e2e8f0; margin-bottom: 20px;
}
.sba-root .modal-header h2 {
  font-size: 1.3rem; font-weight: 700; color: #2d3748; margin: 0;
}
.sba-root .close-btn {
  background: none; border: none; font-size: 1.4rem;
  color: #718096; cursor: pointer; border-radius: 4px; transition: all .2s ease;
}
.sba-root .close-btn:hover { background: #f7fafc; color: #2d3748; }
.sba-root .close-button {
  background: none; border: none; font-size: 1.4rem;
  color: #a0aec0; cursor: pointer; padding: 4px; border-radius: 4px; transition: all .2s ease;
}
.sba-root .close-button:hover { color: #4a5568; background: #f7fafc; }
.sba-root .form-step { }
.sba-root .form-step h3 {
  font-size: 1.1rem; font-weight: 600; color: #2d3748;
  margin-bottom: 16px; padding-bottom: 6px; border-bottom: 2px solid #667eea;
}
.sba-root .form-group { margin-bottom: 16px; }
.sba-root .form-group label {
  display: block; font-weight: 600; color: #4a5568; margin-bottom: 5px; font-size: 0.85rem;
}
.sba-root .form-group input,
.sba-root .form-group select,
.sba-root .form-group textarea {
  width: 100%; padding: 10px; border: 2px solid #e2e8f0;
  border-radius: 8px; font-size: 0.9rem; transition: all .2s ease;
  background: white; font-family: inherit;
}
.sba-root .form-group input:focus,
.sba-root .form-group select:focus,
.sba-root .form-group textarea:focus {
  outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,.1);
}
.sba-root .form-group textarea { resize: vertical; min-height: 70px; }
.sba-root .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.sba-root .products-section { margin-bottom: 20px; }
.sba-root .products-section h4 { font-size: 1rem; font-weight: 600; color: #2d3748; margin-bottom: 12px; }
.sba-root .product-item {
  background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 10px;
  padding: 16px; margin-bottom: 12px; position: relative;
}
.sba-root .remove-btn {
  position: absolute; top: 10px; right: 10px;
  background: #f56565; color: white; border: none;
  padding: 5px 10px; border-radius: 6px; font-size: 0.75rem; cursor: pointer;
}
.sba-root .remove-btn:hover { background: #e53e3e; }
.sba-root .add-btn {
  background: #48bb78; color: white; border: none;
  padding: 9px 14px; border-radius: 8px; font-weight: 600; cursor: pointer;
  display: flex; align-items: center; gap: 6px; font-family: inherit;
}
.sba-root .add-btn:hover { background: #38a169; }
.sba-root .modal-footer {
  padding: 20px 0 0; border-top: 1px solid #e2e8f0;
  display: flex; justify-content: space-between; align-items: center;
}
.sba-root .step-indicator { font-weight: 600; color: #4a5568; font-size: 0.85rem; }
.sba-root .form-actions { display: flex; gap: 10px; }
.sba-root .business-type-toggle { display: flex; gap: 14px; margin-top: 6px; }
.sba-root .toggle-option {
  flex: 1; cursor: pointer; border: 2px solid #e2e8f0;
  border-radius: 10px; padding: 14px; transition: all .2s ease; background: white;
}
.sba-root .toggle-option:hover { border-color: #667eea; background: #f7fafc; }
.sba-root .toggle-option input[type="radio"] { display: none; }
.sba-root .toggle-option:has(input[type="radio"]:checked) {
  border-color: #667eea; background: #f0f4ff;
  box-shadow: 0 0 0 3px rgba(102,126,234,.1);
}
.sba-root .toggle-label { display: block; text-align: center; }
.sba-root .toggle-label strong { display: block; font-size: 1rem; margin-bottom: 3px; }
.sba-root .toggle-label small { display: block; color: #718096; font-size: 0.8rem; }
.sba-root .loading {
  display: flex; align-items: center; justify-content: center;
  padding: 32px; color: #718096;
}
.sba-root .spinner {
  width: 18px; height: 18px;
  border: 2px solid #e2e8f0; border-top: 2px solid #667eea;
  border-radius: 50%; animation: sba-spin 1s linear infinite; margin-left: 8px;
}
@keyframes sba-spin { 0%{transform:rotate(0deg);} 100%{transform:rotate(360deg);} }
.sba-root .typing-indicator {
  display: flex; align-items: center; gap: 4px;
}
.sba-root .typing-indicator span {
  width: 7px; height: 7px; border-radius: 50%;
  background: #667eea; animation: sba-typing 1.4s infinite ease-in-out;
}
.sba-root .typing-indicator span:nth-child(1) { animation-delay: -.32s; }
.sba-root .typing-indicator span:nth-child(2) { animation-delay: -.16s; }
@keyframes sba-typing {
  0%,80%,100% { transform:scale(.8); opacity:.5; }
  40%          { transform:scale(1); opacity:1; }
}
.sba-root .error {
  background: #fed7d7; color: #c53030; padding: 10px 14px;
  border-radius: 8px; border: 1px solid #feb2b2; margin: 12px 0;
}
.sba-root .company-selection-page {
  min-height: 100%; height: 100%;
  display: flex; flex-direction: column;
}
.sba-root .selection-container {
  flex: 1; display: flex; align-items: flex-start;
  justify-content: center; padding: 24px 16px; overflow-y: auto;
}
.sba-root .selection-card {
  background: rgba(255,255,255,.95); backdrop-filter: blur(10px);
  border-radius: 18px; padding: 32px;
  box-shadow: 0 20px 60px rgba(0,0,0,.1);
  border: 1px solid rgba(255,255,255,.2); max-width: 800px; width: 100%;
}
.sba-root .selection-header { text-align: center; margin-bottom: 28px; }
.sba-root .selection-header h2 {
  font-size: 1.6rem; font-weight: 700; color: #2d3748; margin-bottom: 10px;
  display: flex; align-items: center; justify-content: center; gap: 10px;
}
.sba-root .selection-icon { font-size: 1.8rem; }
.sba-root .selection-header p { color: #718096; font-size: 1rem; margin: 0; }
.sba-root .companies-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;
}
.sba-root .company-card {
  background: white; border: 2px solid #e2e8f0; border-radius: 14px;
  padding: 20px; transition: all .3s ease; display: flex; flex-direction: column;
  gap: 10px; position: relative; overflow: hidden;
}
.sba-root .company-main {
  display: flex; align-items: center; gap: 14px; cursor: pointer; flex: 1;
}
.sba-root .company-actions {
  display: flex; gap: 8px; justify-content: flex-end;
  padding-top: 8px; border-top: 1px solid #f0f0f0;
}
.sba-root .demo-btn {
  background: linear-gradient(45deg,#667eea,#764ba2); color: white;
  border: none; padding: 6px 12px; border-radius: 6px;
  font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all .3s ease;
  display: flex; align-items: center; gap: 4px; font-family: inherit;
}
.sba-root .demo-btn:hover { transform:translateY(-1px); box-shadow:0 4px 12px rgba(102,126,234,.3); }
.sba-root .company-card:hover {
  border-color: #667eea; transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(102,126,234,.15);
}
.sba-root .company-card::before {
  content:''; position:absolute; top:0; left:0; right:0; height:3px;
  background: linear-gradient(45deg,#667eea,#764ba2); transform:scaleX(0); transition:transform .3s ease;
}
.sba-root .company-card:hover::before { transform:scaleX(1); }
.sba-root .company-icon {
  font-size: 2rem;
  background: linear-gradient(45deg,#667eea,#764ba2);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  flex-shrink: 0;
}
.sba-root .company-info { flex: 1; }
.sba-root .company-info h3 {
  font-size: 1.1rem; font-weight: 600; color: #2d3748; margin: 0 0 6px 0;
}
.sba-root .company-info p { color: #718096; font-size: 0.9rem; margin: 0 0 8px 0; }
.sba-root .status-badge {
  padding: 3px 10px; border-radius: 10px; font-size: 0.75rem;
  font-weight: 600; text-transform: uppercase; letter-spacing: .5px;
}
.sba-root .status-badge.active {
  background: rgba(72,187,120,.1); color:#38a169; border:1px solid rgba(72,187,120,.3);
}
.sba-root .status-badge.inactive {
  background: rgba(245,101,101,.1); color:#e53e3e; border:1px solid rgba(245,101,101,.3);
}
.sba-root .company-arrow { font-size: 1.3rem; color: #a0aec0; transition: all .3s ease; }
.sba-root .company-card:hover .company-arrow { color: #667eea; transform: translateX(-4px); }
.sba-root .no-companies { text-align: center; padding: 48px 16px; color: #718096; }
.sba-root .no-companies-icon { font-size: 3rem; margin-bottom: 16px; opacity: .5; }
.sba-root .no-companies h3 { font-size: 1.3rem; font-weight: 600; color: #4a5568; margin-bottom: 10px; }
.sba-root .back-button {
  background: none; border: none; font-size: 1.3rem; color: #667eea;
  cursor: pointer; padding: 6px; border-radius: 8px; transition: all .2s ease; margin-left: 10px;
}
.sba-root .back-button:hover { background: rgba(102,126,234,.1); transform:translateX(2px); }
.sba-root .create-company-btn {
  margin-top: 12px; display: inline-flex; align-items: center; gap: 6px;
  background: linear-gradient(135deg,#48bb78,#38a169);
  border: none; color: white; padding: 10px 18px;
  border-radius: 8px; font-weight: 600; cursor: pointer; transition: all .3s ease; font-family: inherit;
}
.sba-root .create-company-btn:hover { transform:translateY(-2px); box-shadow:0 8px 25px rgba(72,187,120,.3); }
.sba-root .company-chat-page {
  min-height: 100%; height: 100%;
  display: flex; flex-direction: column;
}
/* Demo interface */
.sba-root .demo-container {
  display: flex; flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.sba-root .demo-header {
  background: rgba(255,255,255,.95); backdrop-filter: blur(10px);
  padding: 14px 18px; border-bottom: 1px solid rgba(0,0,0,.1);
  display: flex; justify-content: space-between; align-items: center;
  flex-shrink: 0;
}
.sba-root .demo-title {
  display: flex; align-items: center; gap: 10px;
  font-size: 1.2rem; font-weight: 700; color: #2d3748;
}
.sba-root .demo-icon {
  font-size: 1.5rem;
  background: linear-gradient(45deg,#667eea,#764ba2);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.sba-root .demo-stats { display: flex; align-items: center; gap: 16px; }
.sba-root .rating-stats {
  display: flex; align-items: center; gap: 6px;
  background: rgba(102,126,234,.1); padding: 6px 10px;
  border-radius: 18px; border: 1px solid rgba(102,126,234,.2);
}
.sba-root .rating-label { font-size: 0.85rem; color: #4a5568; font-weight: 500; }
.sba-root .rating-value { font-size: 1rem; font-weight: 700; color: #667eea; }
.sba-root .rating-count { font-size: 0.75rem; color: #718096; }
.sba-root .demo-messages {
  flex: 1; overflow-y: auto; padding: 16px;
  background: rgba(255,255,255,.05); backdrop-filter: blur(5px);
}
.sba-root .demo-messages .message {
  display: flex; margin-bottom: 14px; animation: sba-slideIn .3s ease-out;
}
.sba-root .demo-messages .message.user { flex-direction: row-reverse; }
.sba-root .demo-messages .message-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; margin: 0 10px;
  background: rgba(255,255,255,.2); backdrop-filter: blur(10px);
  border: 2px solid rgba(255,255,255,.3);
}
.sba-root .demo-messages .message.user .message-avatar {
  background: linear-gradient(45deg,#667eea,#764ba2); color: white;
}
.sba-root .demo-messages .message.bot .message-avatar {
  background: linear-gradient(45deg,#48bb78,#38a169); color: white;
}
.sba-root .demo-messages .message-content {
  max-width: 70%; background: rgba(255,255,255,.9);
  backdrop-filter: blur(10px); padding: 10px 14px;
  border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,.1);
  border: 1px solid rgba(255,255,255,.3);
}
.sba-root .demo-messages .message.user .message-content {
  background: linear-gradient(135deg,#667eea,#764ba2); color: white;
  border-radius: 16px 16px 4px 16px;
}
.sba-root .demo-messages .message.bot .message-content {
  background: rgba(255,255,255,.95); color: #2d3748;
  border-radius: 16px 16px 16px 4px;
}
.sba-root .message-meta {
  display: flex; align-items: center; gap: 6px;
  margin-top: 6px; font-size: 0.72rem; opacity: .7;
}
.sba-root .handoff-badge {
  background: #fed7d7; color: #c53030; padding: 2px 5px; border-radius: 7px;
  font-size: 0.68rem; font-weight: 600;
}
.sba-root .tone-badge {
  background: #e6fffa; color: #319795; padding: 2px 5px; border-radius: 7px; font-size: 0.68rem;
}
.sba-root .quality-badge { padding: 2px 5px; border-radius: 7px; font-size: 0.68rem; font-weight: 600; }
.sba-root .quality-badge.good  { background: #c6f6d5; color: #2f855a; }
.sba-root .quality-badge.handoff { background: #fed7d7; color: #c53030; }
.sba-root .quality-badge.error { background: #feb2b2; color: #e53e3e; }
.sba-root .demo-typing {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 14px; padding: 0 10px;
}
.sba-root .typing-dots { display: flex; gap: 4px; }
.sba-root .typing-dots span {
  width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,.8);
  animation: sba-typingDot 1.4s infinite ease-in-out;
}
.sba-root .typing-dots span:nth-child(1) { animation-delay: -.32s; }
.sba-root .typing-dots span:nth-child(2) { animation-delay: -.16s; }
@keyframes sba-typingDot {
  0%,80%,100% { transform:scale(0); opacity:.5; }
  40%          { transform:scale(1); opacity:1; }
}
.sba-root .typing-text { color: rgba(255,255,255,.8); font-size: 0.85rem; font-style: italic; }
.sba-root .demo-input {
  background: rgba(255,255,255,.95); backdrop-filter: blur(10px);
  padding: 14px 16px; border-top: 1px solid rgba(0,0,0,.1); flex-shrink: 0;
}
.sba-root .input-container { display: flex; gap: 10px; align-items: flex-end; }
.sba-root .message-input {
  flex: 1; min-height: 42px; max-height: 100px;
  padding: 10px 14px; border: 2px solid rgba(102,126,234,.2);
  border-radius: 20px; font-size: 0.95rem; font-family: inherit;
  resize: none; outline: none; transition: all .3s ease;
  background: rgba(255,255,255,.9); backdrop-filter: blur(10px);
}
.sba-root .message-input:focus { border-color: #667eea; background: white; }
.sba-root .demo-send-button {
  width: 42px; height: 42px; border: none; border-radius: 50%;
  background: linear-gradient(45deg,#667eea,#764ba2); color: white;
  font-size: 1.1rem; cursor: pointer; transition: all .3s ease;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px rgba(102,126,234,.3); flex-shrink: 0;
}
.sba-root .demo-send-button:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 6px 20px rgba(102,126,234,.4); }
.sba-root .demo-send-button:disabled { opacity:.5; cursor:not-allowed; transform:none; }
.sba-root .rating-modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 300; backdrop-filter: blur(5px);
}
.sba-root .rating-modal {
  background: white; border-radius: 14px; padding: 22px;
  max-width: 560px; width: 90%; max-height: 80vh; overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0,0,0,.2); animation: sba-modalSlideIn .3s ease-out;
}
@keyframes sba-modalSlideIn {
  from { opacity:0; transform:scale(.9) translateY(-16px); }
  to   { opacity:1; transform:scale(1) translateY(0); }
}
.sba-root .rating-modal-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;
}
.sba-root .rating-modal-header h3 { margin:0; color:#2d3748; font-size:1.2rem; }
.sba-root .rating-stars {
  display: flex; justify-content: center; gap: 8px; margin-bottom: 10px;
}
.sba-root .star {
  background: none; border: none; font-size: 1.8rem;
  cursor: pointer; transition: all .2s ease; padding: 3px; border-radius: 7px;
}
.sba-root .star:hover { transform: scale(1.1); }
.sba-root .star.active { filter: drop-shadow(0 0 8px rgba(255,193,7,.5)); }
.sba-root .rating-labels {
  display: flex; justify-content: space-between; margin-bottom: 18px;
  color: #718096; font-size: 0.85rem;
}
.sba-root .feedback-input {
  width: 100%; min-height: 70px; padding: 10px;
  border: 2px solid #e2e8f0; border-radius: 8px;
  font-family: inherit; font-size: 0.85rem; resize: vertical; outline: none;
  transition: border-color .2s ease; margin-bottom: 16px;
}
.sba-root .feedback-input:focus { border-color: #667eea; }
.sba-root .rating-actions { display: flex; gap: 10px; justify-content: flex-end; }
.sba-root .skip-button,
.sba-root .submit-button {
  padding: 9px 18px; border-radius: 8px; font-weight: 600; cursor: pointer;
  transition: all .2s ease; border: none; font-family: inherit;
}
.sba-root .skip-button { background: #f7fafc; color: #4a5568; border: 1px solid #e2e8f0; }
.sba-root .skip-button:hover { background: #edf2f7; }
.sba-root .submit-button { background: linear-gradient(45deg,#667eea,#764ba2); color: white; }
.sba-root .submit-button:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 4px 12px rgba(102,126,234,.3); }
.sba-root .submit-button:disabled { opacity:.5; cursor:not-allowed; }
.sba-root .conversation-context {
  background: #f8f9fa; border-radius: 10px; padding: 14px;
  border: 1px solid #e9ecef; margin-bottom: 18px;
}
.sba-root .context-message { display: flex; gap: 10px; margin-bottom: 14px; }
.sba-root .context-message:last-child { margin-bottom: 0; }
.sba-root .context-avatar {
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0;
}
.sba-root .user-message .context-avatar { background: linear-gradient(45deg,#667eea,#764ba2); color:white; }
.sba-root .bot-message .context-avatar { background: linear-gradient(45deg,#48bb78,#38a169); color:white; }
.sba-root .context-content { flex: 1; }
.sba-root .context-label {
  font-size: 0.75rem; font-weight: 600; color: #6c757d;
  margin-bottom: 3px; text-transform: uppercase; letter-spacing: .5px;
}
.sba-root .context-text {
  background: white; padding: 10px; border-radius: 7px;
  border: 1px solid #e9ecef; font-size: 0.85rem; line-height: 1.4;
  color: #495057; white-space: pre-wrap; word-wrap: break-word;
}
.sba-root .rating-section {
  text-align: center; padding: 16px 0;
  border-top: 1px solid #e9ecef; border-bottom: 1px solid #e9ecef; margin: 16px 0;
}
.sba-root .rating-question { font-size: 1rem; font-weight: 600; color: #495057; margin-bottom: 14px; }
.sba-root .feedback-section { display: flex; flex-direction: column; gap: 6px; }
.sba-root .feedback-label { font-size: 0.85rem; font-weight: 600; color: #495057; }
`;

function StyleInjector() {
  return <style dangerouslySetInnerHTML={{ __html: SCOPED_CSS }} />;
}

/* ─── StatsPanel ─────────────────────────────────────────────────────────── */
function StatsPanel({ stats }: { stats: StatsData }) {
  return (
    <div className="stats-panel">
      <div className="stat-card">
        <div className="stat-number">{stats.totalMessages ?? 0}</div>
        <div className="stat-label">הודעות</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.handoffs ?? 0}</div>
        <div className="stat-label">Handoffs</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.conversations ?? 0}</div>
        <div className="stat-label">שיחות</div>
      </div>
    </div>
  );
}

/* ─── CustomerProfile ────────────────────────────────────────────────────── */
function CustomerProfile({ customer }: { customer: Customer | null }) {
  const [profile, setProfile] = useState<CustomerProfileData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setLoading(true);
      fetch(`http://localhost:8080/api/v1/dev/customer/${customer.id}/profile`)
        .then((r) => r.ok ? r.json() : null)
        .then((d) => setProfile(d))
        .catch(() => setProfile(null))
        .finally(() => setLoading(false));
    }
  }, [customer]);

  if (!customer) return null;

  const stageColor: Record<string, string> = {
    new: "#ed8936", interested: "#4299e1", qualified: "#48bb78", converted: "#38a169",
  };
  const stageText: Record<string, string> = {
    new: "לקוח חדש", interested: "מתעניין", qualified: "מוכשר", converted: "הומר",
  };

  return (
    <div className="sidebar-card">
      <h3><span>👤</span> פרופיל לקוח</h3>
      {loading ? (
        <div className="loading"><div className="spinner" />טוען...</div>
      ) : !profile ? (
        <div className="error">שגיאה בטעינת הפרופיל</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            ["שם", profile.name], ["גיל", profile.age], ["מיקום", profile.location],
            ["תפקיד", profile.occupation], ["תקציב", profile.budget_range],
            ["שיחות", profile.total_conversations ?? 0], ["הודעות", profile.total_messages ?? 0],
          ].map(([label, val]) => (
            <div key={String(label)} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
              <strong>{label}:</strong>
              <span style={{ color: "#4a5568" }}>{val || "לא צוין"}</span>
            </div>
          ))}
          {profile.conversion_stage && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", alignItems: "center" }}>
              <strong>שלב:</strong>
              <span style={{
                color: stageColor[profile.conversion_stage] ?? "#a0aec0",
                fontWeight: 600, padding: "2px 7px", borderRadius: "10px",
                background: `${stageColor[profile.conversion_stage] ?? "#a0aec0"}20`, fontSize: "0.8rem",
              }}>
                {stageText[profile.conversion_stage] ?? "לא ידוע"}
              </span>
            </div>
          )}
          {profile.interests && profile.interests.length > 0 && (
            <div style={{ marginTop: "10px" }}>
              <strong style={{ display: "block", marginBottom: "6px", fontSize: "0.85rem" }}>תחומי עניין:</strong>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {profile.interests.map((i, idx) => (
                  <span key={idx} style={{
                    background: "#e2e8f0", color: "#4a5568",
                    padding: "3px 7px", borderRadius: "10px", fontSize: "0.75rem",
                  }}>{i}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── CompanySelector ────────────────────────────────────────────────────── */
function CompanySelector({
  selectedCompany, onCustomerSelect, selectedCustomer,
  onStartConversation, onCreateCustomer,
}: {
  selectedCompany: Company | null;
  onCustomerSelect: (c: Customer | null) => void;
  selectedCustomer: Customer | null;
  onStartConversation: () => void;
  onCreateCustomer: () => void;
}) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCompany) {
      setLoading(true);
      fetch(`http://localhost:8080/api/v1/admin/companies/${selectedCompany.id}/users`)
        .then((r) => r.ok ? r.json() : [])
        .then(setCustomers)
        .catch(() => setCustomers([]))
        .finally(() => setLoading(false));
    } else {
      setCustomers([]);
    }
  }, [selectedCompany]);

  return (
    <div className="sidebar-card">
      <h3><span>👥</span> בחירת לקוח</h3>
      <div style={{ marginBottom: "14px", padding: "10px", background: "#f7fafc", borderRadius: "8px" }}>
        <div style={{ fontSize: "0.85rem", color: "#4a5568" }}>
          <strong>חברה:</strong> {selectedCompany?.name}
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">לקוח</label>
        <select
          className="form-select"
          value={selectedCustomer?.id ?? ""}
          onChange={(e) => {
            const c = customers.find((x) => String(x.id) === e.target.value) ?? null;
            onCustomerSelect(c);
          }}
          disabled={!selectedCompany || loading}
        >
          <option value="">בחר לקוח...</option>
          {loading ? <option disabled>טוען...</option> :
            customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name ?? c.external_id}</option>
            ))
          }
        </select>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
        <button className="btn btn-primary" onClick={onStartConversation} disabled={!selectedCustomer}>
          <span>💬</span> התחל שיחה חדשה
        </button>
        <button className="btn btn-success" onClick={onCreateCustomer}>
          <span>➕</span> צור לקוח חדש
        </button>
      </div>
      {selectedCustomer && (
        <div style={{ marginTop: "14px", padding: "10px", background: "#f7fafc", borderRadius: "8px", fontSize: "0.85rem", color: "#4a5568" }}>
          <strong>נבחר:</strong> {selectedCustomer.name ?? selectedCustomer.external_id}
        </div>
      )}
    </div>
  );
}

/* ─── ChatInterface ──────────────────────────────────────────────────────── */
function ChatInterface({
  company, customer, sessionId, onStatsUpdate,
}: {
  company: Company | null;
  customer: Customer | null;
  sessionId: string | null;
  onStatsUpdate: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [executionPath, setExecutionPath] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("connected");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionId) { setMessages([]); setExecutionPath(["שיחה חדשה התחילה"]); }
  }, [sessionId, company]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const check = () =>
      fetch("http://localhost:8080/health")
        .then((r) => setConnectionStatus(r.ok ? "connected" : "disconnected"))
        .catch(() => setConnectionStatus("disconnected"));
    check();
    const id = setInterval(check, 30000);
    return () => clearInterval(id);
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !sessionId || sending || !company || !customer) return;
    const text = inputMessage.trim();
    setMessages((p) => [...p, { id: Date.now(), role: "user", content: text, timestamp: new Date(), status: "sent" }]);
    setInputMessage("");
    setSending(true);
    setTyping(true);
    try {
      const r = await fetch("http://localhost:8080/api/v1/agent/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_id: company.id, user_id: String(customer.id), session_id: sessionId, message: text, channel: "dev" }),
      });
      if (r.ok) {
        const data = await r.json();
        setMessages((p) => [...p, {
          id: Date.now() + 1, role: "bot", content: data.text, timestamp: new Date(),
          handoff: data.handoff, tone: data.tone, executionPath: data.execution_path,
          status: "delivered", quality: data.handoff ? "handoff" : "good",
        }]);
        if (data.execution_path) setExecutionPath(data.execution_path);
        onStatsUpdate();
      } else {
        setMessages((p) => [...p, { id: Date.now() + 1, role: "bot", content: "שגיאה טכנית. נסה שוב.", timestamp: new Date(), isError: true }]);
      }
    } catch {
      setMessages((p) => [...p, { id: Date.now() + 1, role: "bot", content: "שגיאה בשליחת ההודעה", timestamp: new Date(), isError: true }]);
    } finally {
      setSending(false);
      setTyping(false);
    }
  };

  const fmt = (d: Date) => d.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });

  if (!company || !customer) {
    return (
      <div className="chat-container">
        <div className="chat-header"><div className="chat-title"><span className="chat-icon">💬</span> צ'אט</div></div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#718096" }}>
          בחר חברה ולקוח כדי להתחיל שיחה
        </div>
      </div>
    );
  }
  if (!sessionId) {
    return (
      <div className="chat-container">
        <div className="chat-header"><div className="chat-title"><span className="chat-icon">💬</span> צ'אט - {customer.name ?? customer.external_id}</div></div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#718096" }}>
          לחץ על "התחל שיחה חדשה" כדי להתחיל
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-title">
          <span className="chat-icon">💬</span>
          {customer.name ?? customer.external_id}
          {messages.length > 0 && <span className="message-count-badge">{messages.length} הודעות</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {executionPath.length > 0 && (
            <div style={{ fontSize: "0.75rem", color: "#718096", background: "#f7fafc", padding: "3px 7px", borderRadius: "10px" }}>
              {executionPath.join(" → ")}
            </div>
          )}
          <div className={`connection-status ${connectionStatus}`}>
            <span className="status-dot" />
            {connectionStatus === "connected" ? "מחובר" : "מנותק"}
          </div>
        </div>
      </div>
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.role}`}>
            <div className="message-avatar">{msg.role === "user" ? "👤" : "🤖"}</div>
            <div className="message-content">
              <div>{msg.content}</div>
              <div style={{ fontSize: "0.72rem", opacity: .7, marginTop: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                <span>{fmt(msg.timestamp)}</span>
                {msg.handoff && <span style={{ background: "#fed7d7", color: "#c53030", padding: "1px 5px", borderRadius: "7px", fontSize: "0.68rem", fontWeight: 600 }}>HANDOFF</span>}
                {msg.tone && <span style={{ background: "#e6fffa", color: "#319795", padding: "1px 5px", borderRadius: "7px", fontSize: "0.68rem" }}>{msg.tone}</span>}
              </div>
            </div>
          </div>
        ))}
        {typing && (
          <div className="message bot">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div className="typing-indicator"><span /><span /><span /></div>
                כותב...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text" value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder="הקלד הודעה..." disabled={sending}
        />
        <button className="send-button" onClick={sendMessage} disabled={!inputMessage.trim() || sending}>
          <span>📤</span> שלח
        </button>
      </div>
    </div>
  );
}

/* ─── DemoInterface ──────────────────────────────────────────────────────── */
function DemoInterface({ company }: { company: Company }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [messageStatus, setMessageStatus] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("connected");
  const [currentRating, setCurrentRating] = useState<number | null>(null);
  const [currentFeedback, setCurrentFeedback] = useState("");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingData, setRatingData] = useState<{ rating: number }[]>([]);
  const [lastUserMessage, setLastUserMessage] = useState("");
  const [lastBotMessage, setLastBotMessage] = useState("");
  const [sessionId] = useState(`demo_${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const demoCustomer = { external_id: "demo_customer" };

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    const check = () =>
      fetch("http://localhost:8080/health")
        .then((r) => setConnectionStatus(r.ok ? "connected" : "disconnected"))
        .catch(() => setConnectionStatus("disconnected"));
    check();
    const id = setInterval(check, 30000);
    return () => clearInterval(id);
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim() || sending) return;
    const text = inputMessage;
    setMessages((p) => [...p, { id: Date.now(), role: "user", content: text, timestamp: new Date() }]);
    setLastUserMessage(text);
    setInputMessage("");
    setSending(true);
    setTyping(true);
    setMessageStatus("שולח...");
    try {
      const r = await fetch("http://localhost:8080/api/v1/agent/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, company_id: company.id, customer_id: demoCustomer.external_id, session_id: sessionId, channel: "demo" }),
      });
      if (r.ok) {
        const data = await r.json();
        setMessages((p) => [...p, {
          id: Date.now() + 1, role: "bot", content: data.text, timestamp: new Date(),
          handoff: data.handoff, tone: data.tone, quality: data.handoff ? "handoff" : "good",
        }]);
        setLastBotMessage(data.text);
        if (data.text && !data.handoff) setTimeout(() => setShowRatingModal(true), 3000);
      } else throw new Error("failed");
    } catch {
      setMessages((p) => [...p, { id: Date.now() + 1, role: "bot", content: "שגיאה. נסה שוב.", timestamp: new Date(), quality: "error" }]);
    } finally {
      setSending(false); setTyping(false); setMessageStatus("");
    }
  };

  const submitRating = () => {
    if (currentRating) {
      setRatingData((p) => [...p, { rating: currentRating }]);
      const rating = { id: Date.now(), rating: currentRating, feedback: currentFeedback, companyId: company.id, sessionId };
      fetch("http://localhost:8080/api/v1/feedback/rating", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(rating) }).catch(() => {});
      setCurrentRating(null); setCurrentFeedback(""); setShowRatingModal(false);
    }
  };

  const avgRating = ratingData.length > 0
    ? (ratingData.reduce((s, r) => s + r.rating, 0) / ratingData.length).toFixed(1)
    : "0";

  const fmt = (d: Date) => d.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="demo-container">
      <div className="demo-header">
        <div className="demo-title">
          <span className="demo-icon">🧪</span>
          ממשק דמו — {company.name}
          {messages.length > 0 && <span className="message-count-badge">{messages.length} הודעות</span>}
        </div>
        <div className="demo-stats">
          <div className="rating-stats">
            <span className="rating-label">דירוג:</span>
            <span className="rating-value">{avgRating}/5</span>
            <span className="rating-count">({ratingData.length})</span>
          </div>
          <div className={`connection-status ${connectionStatus}`}>
            <span className="status-dot" />
            {connectionStatus === "connected" ? "מחובר" : "מנותק"}
          </div>
        </div>
      </div>

      <div className="demo-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.role}`}>
            <div className="message-avatar">{msg.role === "user" ? "👤" : "🤖"}</div>
            <div className="message-content">
              <div>{msg.content}</div>
              <div className="message-meta">
                <span>{fmt(msg.timestamp)}</span>
                {msg.handoff && <span className="handoff-badge">HANDOFF</span>}
                {msg.tone && <span className="tone-badge">{msg.tone}</span>}
                {msg.quality && <span className={`quality-badge ${msg.quality}`}>{msg.quality === "handoff" ? "HANDOFF" : "✓"}</span>}
              </div>
            </div>
          </div>
        ))}
        {typing && (
          <div className="demo-typing">
            <div className="typing-dots"><span /><span /><span /></div>
            <span className="typing-text">{messageStatus}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="demo-input">
        <div className="input-container">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="כתוב הודעה לבדיקת הבוט..."
            disabled={sending}
            className="message-input"
          />
          <button onClick={sendMessage} disabled={!inputMessage.trim() || sending} className="demo-send-button">
            {sending ? "⏳" : "📤"}
          </button>
        </div>
      </div>

      {showRatingModal && (
        <div className="rating-modal-overlay">
          <div className="rating-modal">
            <div className="rating-modal-header">
              <h3>דרג את התשובה</h3>
              <button className="close-button" onClick={() => setShowRatingModal(false)}>✕</button>
            </div>
            <div className="conversation-context">
              <div className="context-message user-message">
                <div className="context-avatar">👤</div>
                <div className="context-content">
                  <div className="context-label">השאלה שלך:</div>
                  <div className="context-text">{lastUserMessage}</div>
                </div>
              </div>
              <div className="context-message bot-message">
                <div className="context-avatar">🤖</div>
                <div className="context-content">
                  <div className="context-label">תשובת הבוט:</div>
                  <div className="context-text">{lastBotMessage}</div>
                </div>
              </div>
            </div>
            <div className="rating-section">
              <div className="rating-question">איך תדרג את התשובה?</div>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} className={`star${currentRating !== null && currentRating >= s ? " active" : ""}`} onClick={() => setCurrentRating(s)}>⭐</button>
                ))}
              </div>
              <div className="rating-labels"><span>גרוע</span><span>מעולה</span></div>
            </div>
            <div className="feedback-section">
              <label className="feedback-label">הערות (אופציונלי):</label>
              <textarea value={currentFeedback} onChange={(e) => setCurrentFeedback(e.target.value)}
                placeholder="מה היה טוב? מה ניתן לשפר?" className="feedback-input" />
            </div>
            <div className="rating-actions">
              <button className="skip-button" onClick={() => setShowRatingModal(false)}>דלג</button>
              <button className="submit-button" onClick={submitRating} disabled={!currentRating}>שלח דירוג</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── CreateCustomerModal ────────────────────────────────────────────────── */
function CreateCustomerModal({ company, onClose, onCustomerCreated }: {
  company: Company;
  onClose: () => void;
  onCustomerCreated: (c: Customer) => void;
}) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", age: "", gender: "", location: "", occupation: "", budget_range: "", family_status: "", preferred_contact: "", interests: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { alert("שם הוא שדה חובה"); return; }
    setSubmitting(true);
    try {
      const r = await fetch("http://localhost:8080/api/v1/dev/customers", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, company_id: company.id, age: form.age ? parseInt(form.age) : null, interests: form.interests ? form.interests.split(",").map((s) => s.trim()) : [] }),
      });
      if (r.ok) {
        const d = await r.json();
        alert(`לקוח נוצר! ID: ${d.user_id}`);
        onCustomerCreated({ id: d.user_id, name: form.name, external_id: String(d.user_id) });
      } else {
        const err = await r.json();
        alert("שגיאה: " + (err.detail ?? "שגיאה לא ידועה"));
      }
    } catch (err: unknown) {
      alert("שגיאה: " + (err instanceof Error ? err.message : "unknown"));
    } finally { setSubmitting(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>צור לקוח חדש</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
            <div className="form-group">
              <label className="form-label">שם מלא *</label>
              <input type="text" className="form-input" value={form.name} onChange={(e) => set("name", e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">טלפון</label>
              <input type="tel" className="form-input" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="050-1234567" />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
            <div className="form-group">
              <label className="form-label">אימייל</label>
              <input type="email" className="form-input" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">גיל</label>
              <input type="number" className="form-input" value={form.age} onChange={(e) => set("age", e.target.value)} min="1" max="120" />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
            <div className="form-group">
              <label className="form-label">מגדר</label>
              <select className="form-select" value={form.gender} onChange={(e) => set("gender", e.target.value)}>
                <option value="">בחר...</option>
                <option value="male">זכר</option><option value="female">נקבה</option><option value="other">אחר</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">מיקום</label>
              <input type="text" className="form-input" value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="עיר" />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: "14px" }}>
            <label className="form-label">תחומי עניין (מופרדים בפסיקים)</label>
            <input type="text" className="form-input" value={form.interests} onChange={(e) => set("interests", e.target.value)} placeholder="ספורט, מוזיקה" />
          </div>
          <div className="form-group" style={{ marginBottom: "20px" }}>
            <label className="form-label">הערות</label>
            <textarea className="form-input" value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={2} style={{ resize: "vertical" }} />
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <button type="submit" className="btn btn-success" disabled={submitting}>
              {submitting ? <><div className="spinner" />יוצר...</> : <><span>✅</span> צור לקוח</>}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              <span>❌</span> ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── CreateCompanyModal ─────────────────────────────────────────────────── */
function CreateCompanyModal({ isOpen, onClose, onCompanyCreated }: {
  isOpen: boolean;
  onClose: () => void;
  onCompanyCreated: (c: Company) => void;
}) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", brand_aliases: "", timezone: "Asia/Jerusalem", locale: "he-IL",
    currency: "ILS", business_type: "B2B", one_line_value: "",
    brand_voice: { style: "warm, professional, short_by_default", short_mode_default: true, long_mode_triggers: "", forbidden_words: "", emoji_policy: "mirror_user", closing_tone: "decisive_single_cta" },
    icp: { industries: "", company_size: "", buyer_roles: "" },
    pain_points: "",
    products: [{ id: "starter", name: "", summary: "", base_price: "", addons: "" }] as ProductForm[],
    pricing_policy: { currency: "ILS", plans: [{ plan_id: "starter", from: "", to: "" }], discount_rules: "", addons: "" },
    cta_type: "booking_link", booking_link: "", meeting_length_min: 15,
    qualification_rules: { required: "", bant: { budget_hint: true, authority_hint: true, need: true, timeline: true } },
    objections_playbook: "",
    handoff_rules: { triggers: "", target_queue: "sales-team", user_msg_on_handoff: "מעביר/ה לנציג/ה אנושי/ת ויחזרו אליך ממש בקרוב." },
    custom_fields: { description: "", fields: {} as Record<string, string> },
  });

  const setField = (path: string, value: unknown) => {
    const parts = path.split(".");
    setForm((prev) => {
      if (parts.length === 1) {
        return { ...prev, [parts[0]]: value };
      } else if (parts.length === 2) {
        const parent = prev[parts[0] as keyof typeof prev] as Record<string, unknown>;
        return { ...prev, [parts[0]]: { ...parent, [parts[1]]: value } };
      }
      return prev;
    });
  };
  const arrField = (path: string, v: string) => setField(path, v.split(",").map((s) => s.trim()).filter(Boolean));
  const updateProduct = (i: number, k: keyof ProductForm, v: string) =>
    setForm((p) => ({ ...p, products: p.products.map((pr, idx) => idx === i ? { ...pr, [k]: v } : pr) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        brand_aliases: form.brand_aliases.split(",").map((s) => s.trim()).filter(Boolean),
        pain_points: form.pain_points.split(",").map((s) => s.trim()).filter(Boolean),
        handoff_rules: { ...form.handoff_rules, triggers: form.handoff_rules.triggers.split(",").map((s) => s.trim()).filter(Boolean) },
        brand_voice: { ...form.brand_voice, forbidden_words: form.brand_voice.forbidden_words.split(",").map((s) => s.trim()).filter(Boolean) },
        icp: { ...form.icp, industries: form.icp.industries.split(",").map((s) => s.trim()).filter(Boolean), buyer_roles: form.icp.buyer_roles.split(",").map((s) => s.trim()).filter(Boolean) },
      };
      const r = await fetch("http://localhost:8080/api/v1/admin/companies", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (r.ok) {
        const company = await r.json();
        onCompanyCreated(company);
        onClose();
        setStep(1);
      } else {
        console.error("Error creating company:", await r.text());
      }
    } catch (err) {
      console.error("Error creating company:", err);
    } finally { setLoading(false); }
  };

  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content large-modal">
        <div className="modal-header">
          <h2>צור חברה חדשה</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="form-step">
              <h3>מידע בסיסי</h3>
              <div className="form-group"><label>שם החברה *</label><input type="text" value={form.name} onChange={(e) => setField("name", e.target.value)} required /></div>
              <div className="form-group"><label>כינויים (מופרדים בפסיקים)</label><input type="text" value={form.brand_aliases} onChange={(e) => setField("brand_aliases", e.target.value)} placeholder="Acme, AcmeCo" /></div>
              <div className="form-row">
                <div className="form-group"><label>אזור זמן</label>
                  <select value={form.timezone} onChange={(e) => setField("timezone", e.target.value)}>
                    <option value="Asia/Jerusalem">Asia/Jerusalem</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York</option>
                  </select>
                </div>
                <div className="form-group"><label>שפה</label>
                  <select value={form.locale} onChange={(e) => setField("locale", e.target.value)}>
                    <option value="he-IL">עברית</option><option value="en-US">English</option>
                  </select>
                </div>
              </div>
              <div className="form-group"><label>סוג עסק</label>
                <div className="business-type-toggle">
                  {["B2B", "B2C"].map((t) => (
                    <label key={t} className="toggle-option">
                      <input type="radio" name="btype" value={t} checked={form.business_type === t} onChange={() => setField("business_type", t)} />
                      <span className="toggle-label">
                        <strong>{t}</strong>
                        <small>{t === "B2B" ? "עסק לעסק" : "עסק לצרכן"}</small>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group"><label>הצעת ערך *</label><textarea value={form.one_line_value} onChange={(e) => setField("one_line_value", e.target.value)} placeholder="יותר לידים איכותיים בפחות זמן..." required /></div>
              <div className="form-group"><label>ענפים (מופרדים בפסיקים)</label><input type="text" value={form.icp.industries} onChange={(e) => setField("icp.industries", e.target.value)} placeholder="SaaS B2B, שירותים מקומיים" /></div>
              <div className="form-group"><label>כאבים מרכזיים (מופרדים בפסיקים)</label><textarea value={form.pain_points} onChange={(e) => arrField("pain_points", e.target.value)} placeholder="זמן מענה איטי, חוסר עקביות" /></div>
            </div>
          )}
          {step === 2 && (
            <div className="form-step">
              <h3>מוצרים ומחירים</h3>
              <div className="products-section">
                <h4>מוצרים/חבילות</h4>
                {form.products.map((p, i) => (
                  <div key={i} className="product-item">
                    <div className="form-row">
                      <div className="form-group"><label>שם מוצר</label><input type="text" value={p.name} onChange={(e) => updateProduct(i, "name", e.target.value)} placeholder="חבילת בסיס" /></div>
                      <div className="form-group"><label>מחיר בסיס</label><input type="number" value={p.base_price} onChange={(e) => updateProduct(i, "base_price", e.target.value)} placeholder="900" /></div>
                    </div>
                    <div className="form-group"><label>תיאור קצר</label><input type="text" value={p.summary} onChange={(e) => updateProduct(i, "summary", e.target.value)} placeholder="בוט צ'אט + הובלת לידים" /></div>
                    {form.products.length > 1 && <button type="button" className="remove-btn" onClick={() => setForm((pr) => ({ ...pr, products: pr.products.filter((_, j) => j !== i) }))}>הסר</button>}
                  </div>
                ))}
                <button type="button" className="add-btn" onClick={() => setForm((p) => ({ ...p, products: [...p.products, { id: "", name: "", summary: "", base_price: "", addons: "" }] }))}>+ הוסף מוצר</button>
              </div>
              <div className="form-group"><label>קישור לפגישה</label><input type="url" value={form.booking_link} onChange={(e) => setField("booking_link", e.target.value)} placeholder="https://cal.example.com/acme" /></div>
            </div>
          )}
          {step === 3 && (
            <div className="form-step">
              <h3>כללי מכירות</h3>
              <div className="form-group"><label>מתי להעביר לנציג (פסיקים)</label><input type="text" value={form.handoff_rules.triggers} onChange={(e) => setField("handoff_rules.triggers", e.target.value)} placeholder="בקשת הנחה חריגה, שפה לא נאותה" /></div>
              <div className="form-group"><label>הודעה בעת העברה</label><input type="text" value={form.handoff_rules.user_msg_on_handoff} onChange={(e) => setField("handoff_rules.user_msg_on_handoff", e.target.value)} /></div>
              <div className="form-group"><label>מילים אסורות (פסיקים)</label><input type="text" value={form.brand_voice.forbidden_words} onChange={(e) => setField("brand_voice.forbidden_words", e.target.value)} placeholder="100% מובטח" /></div>
              <div className="form-group"><label>התנגדויות נפוצות ותשובות</label><textarea value={form.objections_playbook} onChange={(e) => setField("objections_playbook", e.target.value)} placeholder='{"יקר": "מחזיר עצמו תוך 2 חודשים"}' rows={4} /></div>
            </div>
          )}
          <div className="modal-footer">
            <div className="step-indicator">שלב {step} מתוך 3</div>
            <div className="form-actions">
              {step > 1 && <button type="button" onClick={() => setStep((s) => s - 1)} className="btn btn-secondary">קודם</button>}
              {step < 3
                ? <button type="button" onClick={() => setStep((s) => s + 1)} className="btn btn-primary">הבא</button>
                : <button type="submit" className="btn btn-success" disabled={loading}>{loading ? "יוצר..." : "צור חברה"}</button>
              }
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── CompanySelectionPage ───────────────────────────────────────────────── */
function CompanySelectionPage({ onCompanySelect, onDemoMode }: {
  onCompanySelect: (c: Company) => void;
  onDemoMode: (c: Company) => void;
}) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState("checking");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadCompanies();
    const check = () =>
      fetch("http://localhost:8080/health")
        .then((r) => setServerStatus(r.ok ? "online" : "offline"))
        .catch(() => setServerStatus("offline"));
    check();
    const id = setInterval(check, 30000);
    return () => clearInterval(id);
  }, []);

  const loadCompanies = () => {
    setLoading(true);
    fetch("http://localhost:8080/api/v1/admin/companies")
      .then((r) => r.ok ? r.json() : [])
      .then(setCompanies)
      .catch(() => setCompanies([]))
      .finally(() => setLoading(false));
  };

  const statusColor = serverStatus === "online" ? "#48bb78" : serverStatus === "offline" ? "#f56565" : "#ed8936";
  const statusText = serverStatus === "online" ? "שרת פעיל" : serverStatus === "offline" ? "שרת לא פעיל" : "בודק חיבור...";

  return (
    <div className="company-selection-page">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">🤖</div>
            <div className="logo-text">
              <h1>AGENT Dev Console</h1>
              <p>ממשק פיתוח לצ&#39;אטבוט המכירות החכם</p>
            </div>
          </div>
          <div className="status-indicator">
            <div className="status-dot" style={{ backgroundColor: statusColor }} />
            <span>{statusText}</span>
          </div>
        </div>
      </header>
      <div className="selection-container">
        <div className="selection-card">
          <div className="selection-header">
            <h2><span className="selection-icon">🏢</span> בחר חברה</h2>
            <p>בחר חברה כדי להתחיל לעבוד עם הלקוחות שלה</p>
            <button className="create-company-btn" onClick={() => setShowCreateModal(true)}>
              <span>➕</span> צור חברה חדשה
            </button>
          </div>
          {loading ? (
            <div className="loading"><div className="spinner" /> טוען חברות...</div>
          ) : (
            <div className="companies-grid">
              {companies.length > 0 ? companies.map((c) => (
                <div key={c.id} className="company-card">
                  <div className="company-main" onClick={() => onCompanySelect(c)}>
                    <div className="company-icon">🏢</div>
                    <div className="company-info">
                      <h3>{c.name}</h3>
                      <p>{c.domain ?? "ללא דומיין"}</p>
                      <div className="company-status">
                        <span className={`status-badge ${c.is_active ? "active" : "inactive"}`}>
                          {c.is_active ? "פעיל" : "לא פעיל"}
                        </span>
                      </div>
                    </div>
                    <div className="company-arrow">←</div>
                  </div>
                  <div className="company-actions">
                    <button className="demo-btn" onClick={(e) => { e.stopPropagation(); onDemoMode(c); }}>
                      🧪 דמו
                    </button>
                  </div>
                </div>
              )) : (
                <div className="no-companies">
                  <div className="no-companies-icon">📭</div>
                  <h3>אין חברות זמינות</h3>
                  <p>צור חברה חדשה כדי להתחיל</p>
                  {serverStatus === "offline" && <p style={{ color: "#f56565", fontSize: "0.85rem", marginTop: "8px" }}>⚠️ שרת לא פעיל — הפעל את ה-backend</p>}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <CreateCompanyModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onCompanyCreated={(c) => { setCompanies((p) => [...p, c]); }} />
    </div>
  );
}

/* ─── CompanyChatPage ────────────────────────────────────────────────────── */
function CompanyChatPage({ selectedCompany, onBackToSelection }: {
  selectedCompany: Company;
  onBackToSelection: () => void;
}) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [stats, setStats] = useState<StatsData>({ totalMessages: 0, handoffs: 0, conversations: 0 });
  const [serverStatus, setServerStatus] = useState("checking");

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/coach/stats")
      .then((r) => r.ok ? r.json() : {})
      .then(setStats).catch(() => {});
    const check = () =>
      fetch("http://localhost:8080/health")
        .then((r) => setServerStatus(r.ok ? "online" : "offline"))
        .catch(() => setServerStatus("offline"));
    check();
    const id = setInterval(check, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      const s = localStorage.getItem(`session_${selectedCustomer.id}`);
      setCurrentSession(s);
    }
  }, [selectedCustomer]);

  const loadStats = () => {
    fetch("http://localhost:8080/api/v1/coach/stats")
      .then((r) => r.ok ? r.json() : {}).then(setStats).catch(() => {});
  };

  const handleStartConversation = async () => {
    if (!selectedCustomer) { alert("בחר לקוח תחילה"); return; }
    try {
      const r = await fetch("http://localhost:8080/api/v1/dev/conversations", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_id: selectedCompany.id, user_id: selectedCustomer.id, channel: "dev" }),
      });
      if (r.ok) {
        const d = await r.json();
        setCurrentSession(d.session_id);
        localStorage.setItem(`session_${selectedCustomer.id}`, d.session_id);
      } else alert("שגיאה ביצירת שיחה");
    } catch { alert("שגיאה ביצירת שיחה"); }
  };

  const statusColor = serverStatus === "online" ? "#48bb78" : serverStatus === "offline" ? "#f56565" : "#ed8936";
  const statusText = serverStatus === "online" ? "שרת פעיל" : serverStatus === "offline" ? "שרת לא פעיל" : "בודק...";

  return (
    <div className="company-chat-page">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <button className="back-button" onClick={onBackToSelection}>→</button>
            <div className="logo-icon">🤖</div>
            <div className="logo-text">
              <h1>{selectedCompany.name}</h1>
              <p>ממשק פיתוח</p>
            </div>
          </div>
          <div className="status-indicator">
            <div className="status-dot" style={{ backgroundColor: statusColor }} />
            <span>{statusText}</span>
          </div>
        </div>
      </header>
      <div className="app-container">
        <div className="sidebar">
          <CompanySelector
            selectedCompany={selectedCompany}
            onCustomerSelect={(c) => {
              setSelectedCustomer(c);
              if (c) { const s = localStorage.getItem(`session_${c.id}`); setCurrentSession(s); }
              else setCurrentSession(null);
            }}
            selectedCustomer={selectedCustomer}
            onStartConversation={handleStartConversation}
            onCreateCustomer={() => setShowCreateModal(true)}
          />
          {selectedCustomer && <CustomerProfile customer={selectedCustomer} />}
        </div>
        <div className="main-content">
          <ChatInterface company={selectedCompany} customer={selectedCustomer} sessionId={currentSession} onStatsUpdate={loadStats} />
          <StatsPanel stats={stats} />
        </div>
      </div>
      {showCreateModal && (
        <CreateCustomerModal
          company={selectedCompany}
          onClose={() => setShowCreateModal(false)}
          onCustomerCreated={(c) => {
            setSelectedCustomer(c);
            setShowCreateModal(false);
            setTimeout(handleStartConversation, 500);
          }}
        />
      )}
    </div>
  );
}

/* ─── Root SalesBotApp ───────────────────────────────────────────────────── */
export function SalesBotApp() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [currentPage, setCurrentPage] = useState<"selection" | "chat" | "demo">("selection");

  return (
    <div className="sba-root">
      <StyleInjector />
      {currentPage === "selection" && (
        <CompanySelectionPage
          onCompanySelect={(c) => { setSelectedCompany(c); setCurrentPage("chat"); }}
          onDemoMode={(c) => { setSelectedCompany(c); setCurrentPage("demo"); }}
        />
      )}
      {currentPage === "chat" && selectedCompany && (
        <CompanyChatPage
          selectedCompany={selectedCompany}
          onBackToSelection={() => { setSelectedCompany(null); setCurrentPage("selection"); }}
        />
      )}
      {currentPage === "demo" && selectedCompany && (
        <DemoInterface company={selectedCompany} />
      )}
    </div>
  );
}

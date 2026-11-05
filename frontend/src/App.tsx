import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
// main page
import { DashboardPage } from './pages/DashboardPage';
import { SearchPage } from './pages/SearchPage';
import { StudyPage } from './pages/StudyPage';
import { QuizPage } from './pages/QuizPage';
// sub page
import { AddPage } from './pages/AddPage';
import { EditPage } from './pages/EditPage';
import { DetailPage } from './pages/DetailPage';
import './App.css';

export const App: React.FC = () => {
    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/study" element={<StudyPage />} />
                        <Route path="/quiz" element={<QuizPage />} />

                        <Route path="/add" element={<AddPage />} />
                        <Route path="/edit/:id" element={<EditPage />} />
                        <Route path="/detail/:id" element={<DetailPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
        );
    };

export default App;
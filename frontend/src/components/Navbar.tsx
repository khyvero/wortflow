import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css'

export const Navbar: React.FC = () => {
    const navClass = ({isActive}: {isActive: boolean}) =>
        `nav-item ${isActive ? 'active' : ''}`;

    return (
        <header className="navbar">
            <div className="navbar-container">
                {/* Brand Logo*/}
                <div className="navbar-brand">
                    <span className="brand-icon">V</span>
                    <span className="brand-name">VocabStore</span>
                </div>

                {/* Center Navigation Tabs */}
                <nav className="navbar-links">
                    <NavLink to="/dashboard" className={navClass}>
                        Dashboard
                    </NavLink>

                    <NavLink to="/search" className={navClass}>
                        Search
                    </NavLink>

                    <NavLink to="/study" className={navClass}>
                        Study
                    </NavLink>

                    <NavLink to="/quiz" className={navClass}>
                        Quiz
                    </NavLink>
                </nav>

                {/* Right Section: Streak & User Avatar */}
                <div className="navbar-user">
                    <div className="streak-badge">
                        <span>🔥 12 day streak</span>
                    </div>
                    <div className="user-avatar" title="User Profile" />
                </div>
            </div>
        </header>
    );
};

// Define available pages as a TypeScript union type
// export type TabType = 'dashboard' | 'search' | 'study' | 'quiz';
//
// interface NavbarProps {
//   activeTab: TabType;
//   onTabChange: (tab: TabType) => void;
// }
//
// export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
//     return (
//         <header className="navbar">
//             <div className="navbar-container">
//                 {/* Brand Logo*/}
//                 <div className="navbar-brand">
//                     <span className="brand-icon">V</span>
//                     <span className="brand-name">VocabSore</span>
//                 </div>
//
//                 {/* Center Navigation Tabs */}
//                 <nav className="navbar-links">
//                     <button
//                         className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
//                         onClick={() => onTabChange('dashboard')}
//                     >
//                         Dashboard
//                     </button>
//
//                     <button
//                         className={`nav-item ${activeTab === 'search' ? 'active' : ''}`}
//                         onClick={() => onTabChange('search')}
//                     >
//                         Search
//                     </button>
//
//                     <button
//                         className={`nav-item ${activeTab === 'study' ? 'active' : ''}`}
//                         onClick={() => onTabChange('study')}
//                     >
//                         Study
//                     </button>
//
//                     <button
//                         className={`nav-item ${activeTab === 'quiz' ? 'active' : ''}`}
//                         onClick={() => onTabChange('quiz')}
//                     >
//                         Quiz
//                     </button>
//                 </nav>
//
//                 {/* Right Section: Streak & User Avatar */}
//                 <div className="navbar-user">
//                     <div className="streak-badge">
//                         <span>🔥 12 day streak</span>
//                     </div>
//                     <div className="user-avatar" title="User Profile" />
//                 </div>
//             </div>
//         </header>
//     );
// };
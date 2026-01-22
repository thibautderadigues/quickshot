import React, { useRef } from 'react';
import logo from '../../assets/logo.png';
import fileLeft from '../../assets/file-left.png';
import fileRight from '../../assets/file-right.png';
import backgroundImg from '../../assets/background.png';

const LandingPage = ({ onImageUpload }) => {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const styles = {
    colors: {
      bg: '#000000',
      accent: '#FFAA01',
    },
    fonts: {
      title: '"Neue Regrade", sans-serif',
      body: '"DM Sans", sans-serif',
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#000000]">
      <div className="w-full h-screen max-h-[900px] flex items-stretch font-sans overflow-hidden bg-[#000000] antialiased">
        
        {/* --- COLONNE GAUCHE --- */}
        <div className="flex flex-col h-full pl-[50px] pr-[50px] py-[50px] z-10 shrink-0 border-none relative bg-[#000000]">
          <div className="shrink-0 mb-12">
             <img src={logo} alt="Logo" className="h-6 w-auto" />
          </div>

          <div className="flex-1 flex flex-col justify-center items-start text-left pb-24">
            <div className="mb-5 relative inline-block px-1">
               <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-l border-b" style={{ borderColor: styles.colors.accent }}></div>
               <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r" style={{ borderColor: styles.colors.accent }}></div>
               <span className="block px-2 py-1" style={{ 
                 color: styles.colors.accent,
                 fontFamily: styles.fonts.title,
                 fontSize: '16px',
                 fontWeight: 500,
                 lineHeight: '1'
               }}>
                 easy, quick and free
               </span>
            </div>
            
            <h1 style={{ 
              fontFamily: styles.fonts.title,
              color: '#FFFFFF',
              fontSize: '42px',
              fontWeight: 600,
              letterSpacing: '-0.03em',
              lineHeight: '1.1'
            }}>
              Beautiful screenshots <br />
              in a few seconds.
            </h1>
            
            <div className="h-[16px]"></div>

            <p style={{
              fontFamily: styles.fonts.body,
              color: 'rgba(255, 255, 255, 0.5)', 
              fontSize: '15px',
              fontWeight: 360, 
              lineHeight: '1.4', 
              maxWidth: '430px',
              width: '100%',
              letterSpacing: '-0.01em', 
            }}>
              Turn your boring screenshots into stunning visuals instantly. 
              Import, customize, and quickly export high-quality images 
              for your social media or portfolio.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-4 mt-auto">
               <div className="flex -space-x-3">
                   {[1, 2, 3, 4].map((i) => (
                      <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" className="w-8 h-8 rounded-full border-2 border-[#000000] grayscale opacity-60"/>
                   ))}
               </div>
               <p style={{
                 fontFamily: styles.fonts.body,
                 color: '#FFFFFF',
                 fontSize: '13px',
                 fontWeight: 500,
                 opacity: 0.4,
                 lineHeight: '1.2'
               }}>
                 Join Users all <br /> 
                 around the world
               </p>
          </div>
        </div>

        {/* --- COLONNE DROITE --- */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden p-8">
           <div className="absolute inset-0 z-0 pointer-events-none">
              <img src={backgroundImg} alt="" className="w-full h-full object-cover opacity-40" />
           </div>

           <div className="relative z-10 bg-[#000000] border border-white/10 rounded-[24px] p-[14px] shadow-2xl flex-none w-auto h-auto">
              
              {/* FRAME INTERNE : 'group' active l'animation des enfants au survol de la frame */}
              <div className="w-[460px] min-h-[310px] bg-[#000000] rounded-[8px] relative overflow-hidden group px-[40px] py-[46px] flex flex-col items-center">
                  
                  {/* SVG BORDER */}
                  <div className="absolute inset-0 pointer-events-none">
                    <svg className="w-full h-full">
                      <rect 
                        x="1" y="1" 
                        width="99.5%" height="99%" 
                        rx="8" ry="8" 
                        fill="none" 
                        stroke="rgba(255, 255, 255, 0.19)" 
                        strokeWidth="1"       
                        strokeDasharray="10 10" 
                        className="group-hover:stroke-white/25 transition-colors duration-500"
                      />
                    </svg>
                  </div>
                  
                  {/* DOSSIERS */}
                  <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-[80%] flex items-center justify-center pointer-events-none z-0">
                      <img src={fileLeft} alt="" 
                        className="relative translate-x-6 translate-y-5 opacity-80 transition-all duration-500 group-hover:translate-y-4 group-hover:-rotate-6" 
                        style={{ height: '120px' }} 
                      />
                      <img src={fileRight} alt="" 
                        className="relative -translate-x-6 translate-y-5 z-10 transition-all duration-500 group-hover:translate-y-4 group-hover:rotate-6" 
                        style={{ height: '120px' }} 
                      />
                  </div>

                  {/* BOUTON JAUNE */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
                      <button 
                        onClick={handleButtonClick}
                        // MODIFS :
                        // 1. group-hover:scale-[1.02] -> Scale très subtil déclenché par la frame.
                        // 2. Retrait complet de shadow orange et brightness.
                        // 3. active:scale-95 pour le clic reste là.
                        className="flex items-center gap-2 text-black bg-[#FFAA01] px-[18px] py-[12px] rounded-[9px] transition-transform duration-500 transform active:scale-95 group-hover:scale-[1.02] shadow-lg shadow-black/60 cursor-pointer"
                      >
                          <span style={{ fontFamily: styles.fonts.title, fontWeight: 600, fontSize: '16px' }}>
                            Upload image
                          </span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                      </button>
                  </div>

                  {/* TEXTES */}
                  <div className="mt-auto relative z-10 flex flex-col items-center space-y-[4px] text-center w-full">
                      <p style={{ fontFamily: styles.fonts.body, fontWeight: 360, fontSize: '16px', color: '#FFFFFF' }}>
                        Choose an image or drag & drop it here.
                      </p>
                      <p style={{ fontFamily: styles.fonts.body, fontWeight: 360, fontSize: '16px', color: 'rgba(255, 255, 255, 0.5)' }}>
                        or press ⌘ + V to paste
                      </p>
                  </div>

                  <input 
                    ref={fileInputRef}
                    type="file" 
                    onChange={onImageUpload} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30" 
                  />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
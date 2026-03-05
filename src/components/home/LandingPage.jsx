import React, { useRef, useEffect, useState } from 'react';
import logo from '../../assets/Logo.webp';
import fileLeft from '../../assets/file-left.webp';
import fileRight from '../../assets/file-right.webp';
import backgroundImg from '../../assets/background.webp';

const LandingPage = ({ onImageUpload }) => {
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  // NOUVEAU : État pour stocker le fichier en cours d'import
  const [importingFile, setImportingFile] = useState(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const processFile = (file) => {
    // SÉCURITÉ
    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed (JPG, PNG, WEBP...)');
      return;
    }

    // ON ENREGISTRE LE FICHIER ET ON LANCE LE CHARGEMENT
    setImportingFile(file);
    setIsLoading(true);

    // Délai de 1 seconde pour l'UX
    setTimeout(() => {
      const syntheticEvent = {
        target: {
          files: [file]
        },
        preventDefault: () => {} 
      };
      onImageUpload(syntheticEvent);
      // Optionnel : reset de l'état une fois fini
      // setIsLoading(false); 
      // setImportingFile(null);
    }, 1000); 
  };

  const handleInputCheck = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  useEffect(() => {
    const handlePaste = (event) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          processFile(blob);
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [onImageUpload]);

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
      <div className="w-full min-h-screen md:h-screen md:max-h-[900px] flex flex-col md:flex-row items-stretch font-sans overflow-y-auto md:overflow-hidden bg-[#000000] antialiased">
        
        {/* --- COLONNE GAUCHE --- */}
        <div className="flex flex-col px-6 pt-14 pb-4 md:px-[50px] md:py-[50px] z-10 shrink-0 border-none relative bg-[#000000]">
          <div className="shrink-0 mb-8 md:mb-12 self-start">
             <img src={logo} alt="Logo" className="h-5 md:h-6 w-auto" />
          </div>

          <div className="flex-1 flex flex-col justify-center items-center text-center md:items-start md:text-left pb-4 md:pb-24">
            <div className="mb-4 md:mb-5 relative inline-block px-1">
               <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-l border-b" style={{ borderColor: styles.colors.accent }}></div>
               <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r" style={{ borderColor: styles.colors.accent }}></div>
               <span className="block px-2 py-1 text-sm md:text-base" style={{ 
                 color: styles.colors.accent,
                 fontFamily: styles.fonts.title,
                 fontWeight: 500,
                 lineHeight: '1'
               }}>
                 easy, quick and free
               </span>
            </div>
            
            <h1 className="text-[28px] md:text-[42px]" style={{ 
              fontFamily: styles.fonts.title,
              color: '#FFFFFF',
              fontWeight: 600,
              letterSpacing: '-0.03em',
              lineHeight: '1.1'
            }}>
              Beautiful screenshots
              <br />
              in a few seconds.
            </h1>
            
            <div className="h-3 md:h-4"></div>

            <p className="text-[13px] md:text-[15px]" style={{
              fontFamily: styles.fonts.body,
              color: 'rgba(255, 255, 255, 0.5)', 
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

          <div className="shrink-0 hidden md:flex items-center gap-4 mt-auto">
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
        <div className="flex items-start justify-center relative overflow-hidden px-4 pb-10 md:flex-1 md:items-center md:p-8">
           <div className="absolute inset-0 z-0 pointer-events-none hidden md:block">
              <img src={backgroundImg} alt="" className="w-full h-full object-cover opacity-40" />
           </div>

           <div className="relative z-10 bg-[#000000] border border-white/10 rounded-[20px] md:rounded-[24px] p-2.5 md:p-[14px] shadow-2xl w-full max-w-[488px]">
              
              <div className="w-full min-h-[220px] md:min-h-[310px] bg-white/[0.04] rounded-[8px] relative overflow-hidden group px-5 py-6 md:px-[40px] md:py-[46px] flex flex-col items-center justify-center">
                  
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
                        className={`transition-colors duration-500 ${isLoading ? 'stroke-white/10' : 'group-hover:stroke-white/30'}`}
                      />
                    </svg>
                  </div>
                  
                  {isLoading && importingFile ? (
                    <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300 w-full px-2 md:px-4">
                        <div className="relative mb-6">
                            <div className="w-12 h-12 border-4 border-white/10 rounded-full"></div>
                            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-[#FFAA01] rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        
                        <div className="flex items-center gap-3 bg-white/5 px-4 py-3 rounded-lg border border-white/10 max-w-full">
                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#FFAA01] shrink-0">
                                <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
                                <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375h1.875c1.148 0 2.22.458 3.032 1.268l.364.364a.75.75 0 001.06-1.06l-.364-.364a6.75 6.75 0 00-3.381-1.763L14.025.589a.75.75 0 00-1.054 1.227z" />
                            </svg>
                            <div className="text-left overflow-hidden">
                                 <p style={{ fontFamily: styles.fonts.body, fontWeight: 400, fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '2px' }}>
                                   Importing...
                                </p>
                                <p className="truncate" style={{ fontFamily: styles.fonts.body, fontWeight: 500, fontSize: '14px', color: '#FFFFFF' }} title={importingFile.name}>
                                   {importingFile.name}
                                </p>
                            </div>
                        </div>
                    </div>
                  ) : (
                    <>
                        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-[80%] flex items-center justify-center pointer-events-none z-0">
                            <img src={fileLeft} alt="" 
                                className="relative translate-x-6 translate-y-5 opacity-80 transition-all duration-500 group-hover:translate-y-4 group-hover:-rotate-6 h-[80px] md:h-[120px]" 
                            />
                            <img src={fileRight} alt="" 
                                className="relative -translate-x-6 translate-y-5 z-10 transition-all duration-500 group-hover:translate-y-4 group-hover:rotate-6 h-[80px] md:h-[120px]" 
                            />
                        </div>

                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
                            <button 
                                onClick={handleButtonClick}
                                className="flex items-center gap-1.5 text-black bg-[#FFAA01] px-4 py-2.5 md:px-[18px] md:py-[12px] rounded-full transition-transform duration-500 transform active:scale-95 group-hover:scale-[1.02] shadow-lg shadow-black/60 cursor-pointer whitespace-nowrap"
                            >
                                <span className="text-[14px] md:text-base" style={{ fontFamily: styles.fonts.title, fontWeight: 600 }}>
                                    Upload image
                                </span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                            </button>
                        </div>

                        <div className="mt-auto relative z-10 flex flex-col items-center space-y-1 text-center w-full">
                            <p className="text-[14px] md:text-base max-w-[180px] md:max-w-none" style={{ fontFamily: styles.fonts.body, fontWeight: 360, color: '#FFFFFF' }}>
                                Choose an image or drag & drop it here.
                            </p>
                            <p className="hidden md:block" style={{ fontFamily: styles.fonts.body, fontWeight: 360, fontSize: '16px', color: 'rgba(255, 255, 255, 0.5)' }}>
                                or press ⌘ + V to paste
                            </p>
                        </div>

                        <input 
                            ref={fileInputRef}
                            type="file"
                            accept="image/*" 
                            onChange={handleInputCheck} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30" 
                        />
                    </>
                  )}

              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
const language_id: { [key: string]: number } = {
  "c++": 54,
  "java": 62,
  "javascript": 63,
  "python": 71,     
  "python3": 71,    
  "typescript": 74  
};

const getLanguageById = (lang: string) => {
  return language_id[lang.toLowerCase()];
};

export default getLanguageById;
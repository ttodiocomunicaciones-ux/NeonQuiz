import { Question } from '../types';

// CompactQ: [Question, Op1, Op2, Op3, Op4, OriginalCorrectIndex]
type CompactQ = [string, string, string, string, string, number];

const shuffle = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const expandQs = (cqs: CompactQ[], themeId: string, level: number): Question[] => {
  return cqs.map((q, i) => {
    const originalOptions = [q[1], q[2], q[3], q[4]];
    const correctAnswerText = originalOptions[q[5]];
    const shuffledOptions = shuffle(originalOptions);
    const newCorrectIndex = shuffledOptions.indexOf(correctAnswerText);
    return {
      id: `${themeId}-${level}-${i}-${Date.now()}-${Math.random()}`,
      text: q[0],
      options: shuffledOptions,
      correctIndex: newCorrectIndex
    };
  });
};

// --- DATABASE COLLECTIONS ---

const DB_CARS: CompactQ[] = [
  ['¿Qué marca fabrica el Mustang?', 'Ford', 'Chevrolet', 'Dodge', 'Audi', 0],
  ['¿Qué significa "RPM"?', 'Revoluciones por minuto', 'Ruedas por metro', 'Rápido por motor', 'Rotación parcial', 0],
  ['¿País de origen de Ferrari?', 'Italia', 'Francia', 'Alemania', 'España', 0],
  ['¿Logo con 4 aros entrelazados?', 'Audi', 'BMW', 'Mercedes', 'Toyota', 0],
  ['¿Qué es un motor V8?', 'Motor de 8 cilindros en V', 'Motor de 8 valvulas', 'Motor de 8 litros', 'Motor eléctrico', 0],
  ['¿Coche más vendido de la historia?', 'Toyota Corolla', 'VW Beetle', 'Ford T', 'Golf', 0],
  ['¿Marca de lujo de Toyota?', 'Lexus', 'Infiniti', 'Acura', 'Genesis', 0],
  ['¿Qué parte frena el coche?', 'Pastillas de freno', 'Alternador', 'Cigüeñal', 'Bujía', 0],
  ['¿Combustible del Tesla Model S?', 'Electricidad', 'Gasolina', 'Diesel', 'Hidrógeno', 0],
  ['¿Color icónico de Ferrari?', 'Rojo', 'Amarillo', 'Negro', 'Azul', 0],
  ['¿Fabricante del 911?', 'Porsche', 'Lamborghini', 'Bugatti', 'Fiat', 0],
  ['¿Qué significa BMW?', 'Bayerische Motoren Werke', 'British Motor Works', 'Berlin Motor Wagons', 'Bavarian Machine Works', 0],
  ['¿Coche de "Volver al Futuro"?', 'DeLorean', 'Mustang', 'Camaro', 'Ferrari', 0],
  ['¿Marca del modelo Civic?', 'Honda', 'Hyundai', 'Mazda', 'Nissan', 0],
  ['¿País de Volvo?', 'Suecia', 'Noruega', 'Alemania', 'Suiza', 0],
  ['¿Qué marca tiene un toro en su logo?', 'Lamborghini', 'Ferrari', 'Porsche', 'Maserati', 0],
  ['¿Qué es el ABS?', 'Sistema Antibloqueo de Frenos', 'Asistencia Básica de Salida', 'Auto Balance System', 'Air Bag System', 0],
  ['¿Quién fundó Ford?', 'Henry Ford', 'John Ford', 'Harrison Ford', 'Gerald Ford', 0],
  ['¿Coche famoso de James Bond?', 'Aston Martin DB5', 'Jaguar E-Type', 'Rolls Royce', 'Bentley', 0],
  ['¿Marca del modelo "Supra"?', 'Toyota', 'Nissan', 'Mazda', 'Honda', 0],
  ['¿Qué marca es dueña de Bugatti?', 'Volkswagen Group', 'BMW', 'Mercedes', 'Fiat', 0],
  ['¿Qué es un turbo?', 'Compresor de aire', 'Inyector de gasolina', 'Freno potente', 'Tipo de rueda', 0],
  ['¿Modelo icónico de Volkswagen?', 'Beetle (Escarabajo)', 'Golf', 'Polo', 'Passat', 0],
  ['¿De dónde es la marca Hyundai?', 'Corea del Sur', 'Japón', 'China', 'Vietnam', 0],
  ['¿Qué significa SUV?', 'Sport Utility Vehicle', 'Super Urban Van', 'Speed Utility Van', 'Standard Utility Vehicle', 0],
  ['¿Marca con una estrella de 3 puntas?', 'Mercedes-Benz', 'Subaru', 'Chrysler', 'Jeep', 0],
  ['¿Coche apodado "Godzilla"?', 'Nissan GT-R', 'Toyota Supra', 'Mazda RX-7', 'Honda NSX', 0],
  ['¿Motor rotativo es famoso en...?', 'Mazda', 'Toyota', 'Honda', 'Suzuki', 0],
  ['¿Primer coche producido en masa?', 'Ford T', 'Benz Patent', 'VW Beetle', 'Citroen 2CV', 0],
  ['¿Qué marca fabrica el "Chiron"?', 'Bugatti', 'Koenigsegg', 'Pagani', 'McLaren', 0],
  ['¿Neumáticos de F1 son de marca...?', 'Pirelli', 'Michelin', 'Bridgestone', 'Goodyear', 0],
  ['¿Marca de lujo de Honda?', 'Acura', 'Lexus', 'Infiniti', 'Genesis', 0],
  ['¿Qué mide el odómetro?', 'Distancia recorrida', 'Velocidad', 'Revoluciones', 'Temperatura', 0],
  ['¿Coche fantástico (KITT) era un...?', 'Pontiac Trans Am', 'Chevrolet Camaro', 'Ford Mustang', 'Dodge Charger', 0],
  ['¿Marca del "Escarabajo"?', 'Volkswagen', 'Citroën', 'Fiat', 'Mini', 0]
];

const DB_GENERAL: CompactQ[] = [
  ['¿Capital de Francia?', 'París', 'Londres', 'Roma', 'Madrid', 0],
  ['¿Pintor de la Mona Lisa?', 'Da Vinci', 'Picasso', 'Van Gogh', 'Dalí', 0],
  ['¿Continente más grande?', 'Asia', 'África', 'América', 'Europa', 0],
  ['¿Moneda de Japón?', 'Yen', 'Won', 'Dólar', 'Yuan', 0],
  ['¿Año llegada a la Luna?', '1969', '1950', '1975', '1960', 0],
  ['¿Elemento químico O?', 'Oxígeno', 'Oro', 'Osmio', 'Olivo', 0],
  ['¿Autor del Quijote?', 'Cervantes', 'Borges', 'García Márquez', 'Neruda', 0],
  ['¿Río más largo del mundo?', 'Amazonas', 'Nilo', 'Yangtsé', 'Misisipi', 0],
  ['¿Cuántos huesos tiene el cuerpo?', '206', '150', '300', '100', 0],
  ['¿País con más habitantes?', 'India', 'China', 'USA', 'Rusia', 0],
  ['¿Idioma más hablado?', 'Inglés', 'Español', 'Chino Mandarín', 'Hindi', 0],
  ['¿Diosa griega de la sabiduría?', 'Atenea', 'Afrodita', 'Hera', 'Artemisa', 0],
  ['¿Presidente de USA en Guerra Civil?', 'Lincoln', 'Washington', 'Roosevelt', 'Kennedy', 0],
  ['¿Instrumento de Chopin?', 'Piano', 'Violín', 'Guitarra', 'Flauta', 0],
  ['¿Planeta Rojo?', 'Marte', 'Júpiter', 'Venus', 'Saturno', 0],
  ['¿Capital de Australia?', 'Canberra', 'Sídney', 'Melbourne', 'Perth', 0],
  ['¿Metal líquido a temperatura ambiente?', 'Mercurio', 'Hierro', 'Plomo', 'Aluminio', 0],
  ['¿País con forma de bota?', 'Italia', 'Grecia', 'España', 'Portugal', 0],
  ['¿Libro sagrado del Islam?', 'Corán', 'Biblia', 'Torá', 'Vedas', 0],
  ['¿Quién descubrió América?', 'Colón', 'Magallanes', 'Vespucio', 'Cortés', 0],
  ['¿Simbolo químico del Oro?', 'Au', 'Ag', 'Fe', 'Cu', 0],
  ['¿Animal terrestre más rápido?', 'Guepardo', 'León', 'Caballo', 'Gacela', 0],
  ['¿Pintor de "La Noche Estrellada"?', 'Van Gogh', 'Monet', 'Dalí', 'Rembrandt', 0],
  ['¿Capital de Alemania?', 'Berlín', 'Múnich', 'Frankfurt', 'Hamburgo', 0],
  ['¿Moneda de Reino Unido?', 'Libra', 'Euro', 'Dólar', 'Franco', 0],
  ['¿País de los canguros?', 'Australia', 'Nueva Zelanda', 'Sudáfrica', 'Brasil', 0],
  ['¿Órgano que bombea sangre?', 'Corazón', 'Hígado', 'Pulmón', 'Riñón', 0],
  ['¿Cuántos días tiene un año bisiesto?', '366', '365', '364', '360', 0],
  ['¿Gas que respiramos?', 'Oxígeno', 'Hidrógeno', 'Helio', 'Metano', 0],
  ['¿Capital de Canadá?', 'Ottawa', 'Toronto', 'Montreal', 'Vancouver', 0],
  ['¿Triángulo con 3 lados iguales?', 'Equilátero', 'Isósceles', 'Escaleno', 'Rectángulo', 0],
  ['¿Dónde están las pirámides?', 'Egipto', 'México', 'Perú', 'China', 0],
  ['¿Autor de Romeo y Julieta?', 'Shakespeare', 'Dickens', 'Orwell', 'Twain', 0],
  ['¿Mar entre Europa y África?', 'Mediterráneo', 'Báltico', 'Negro', 'Rojo', 0],
  ['¿Cuántos colores tiene el arcoíris?', '7', '6', '8', '5', 0]
];

const DB_GAMING: CompactQ[] = [
  ['¿Mascota de Nintendo?', 'Mario', 'Sonic', 'Link', 'Pikachu', 0],
  ['¿Juego de bloques y construcción?', 'Minecraft', 'Roblox', 'Terraria', 'Lego', 0],
  ['¿Protagonista de Halo?', 'Master Chief', 'Kratos', 'Doom Guy', 'Snake', 0],
  ['¿Consola más vendida de la historia?', 'PS2', 'DS', 'Switch', 'PS4', 0],
  ['¿Estudio creador de GTA?', 'Rockstar', 'Ubisoft', 'EA', 'Activision', 0],
  ['¿Nombre del hermano de Mario?', 'Luigi', 'Wario', 'Yoshi', 'Toad', 0],
  ['¿Juego Battle Royale popular?', 'Fortnite', 'Overwatch', 'Valorant', 'LoL', 0],
  ['¿Protagonista de Zelda?', 'Link', 'Zelda', 'Ganon', 'Navi', 0],
  ['¿Año lanzamiento PS1?', '1994', '2000', '1990', '1998', 0],
  ['¿Erizó azul de Sega?', 'Sonic', 'Tails', 'Knuckles', 'Shadow', 0],
  ['¿Juego de fútbol de EA?', 'FC (FIFA)', 'PES', 'Winning Eleven', 'Dream League', 0],
  ['¿Asesino en Assassin’s Creed 2?', 'Ezio', 'Altair', 'Connor', 'Arno', 0],
  ['¿Ciudad de Resident Evil?', 'Raccoon City', 'Silent Hill', 'Midgar', 'Vice City', 0],
  ['¿Hongo malo de Mario?', 'Goomba', 'Koopa', 'Boo', 'Shy Guy', 0],
  ['¿FPS competitivo de Valve?', 'CS:GO', 'Cod', 'Battlefield', 'Halo', 0],
  ['¿Protagonista de Tomb Raider?', 'Lara Croft', 'Jill Valentine', 'Samus Aran', 'Aloy', 0],
  ['¿Pokémon número 25?', 'Pikachu', 'Charmander', 'Squirtle', 'Bulbasaur', 0],
  ['¿Compañía creadora de PlayStation?', 'Sony', 'Microsoft', 'Nintendo', 'Sega', 0],
  ['¿Villano principal de Mario?', 'Bowser', 'Ganon', 'Dr. Eggman', 'Sephiroth', 0],
  ['¿Juego de vaqueros de Rockstar?', 'Red Dead Redemption', 'Gun', 'Call of Juarez', 'Desperados', 0],
  ['¿Mundo de World of Warcraft?', 'Azeroth', 'Tamriel', 'Hyrule', 'Tierra Media', 0],
  ['¿Protagonista de God of War?', 'Kratos', 'Atreus', 'Zeus', 'Ares', 0],
  ['¿Nombre de Pac-Man original?', 'Puck-Man', 'Eat-Man', 'Ghost-Man', 'Ball-Man', 0],
  ['¿Creador de Metal Gear?', 'Hideo Kojima', 'Miyamoto', 'Nomura', 'Sakaguchi', 0],
  ['¿Juego de impostores?', 'Among Us', 'Fall Guys', 'Fortnite', 'Mafia', 0],
  ['¿Héroe de Final Fantasy VII?', 'Cloud', 'Squall', 'Tidus', 'Zidane', 0],
  ['¿Compañía dueña de Xbox?', 'Microsoft', 'Apple', 'Google', 'Amazon', 0],
  ['¿Año lanzamiento Switch?', '2017', '2015', '2019', '2012', 0],
  ['¿Juego de coches y fútbol?', 'Rocket League', 'FIFA', 'Need for Speed', 'Mario Kart', 0],
  ['¿Pelota rosa de Nintendo?', 'Kirby', 'Jigglypuff', 'Ditto', 'Mew', 0],
  ['¿Cazador de vampiros (Castlevania)?', 'Belmont', 'Alucard', 'Dracula', 'Soma', 0],
  ['¿Juego difícil "You Died"?', 'Dark Souls', 'Skyrim', 'Fable', 'Witcher', 0],
  ['¿Ciudad de FF7?', 'Midgar', 'Zanarkand', 'Cocoon', 'Insomnia', 0],
  ['¿Quién es el Jefe Maestro?', 'John-117', 'Cortana', 'Arbiter', 'Noble 6', 0],
  ['¿MOBA de Valve?', 'Dota 2', 'LoL', 'Smite', 'HoTS', 0]
];

const DB_TECH: CompactQ[] = [
  ['¿Creador de Microsoft?', 'Bill Gates', 'Steve Jobs', 'Elon Musk', 'Zuckerberg', 0],
  ['¿Qué significa CPU?', 'Central Processing Unit', 'Computer Personal Unit', 'Central Power Unit', 'Core Process Unit', 0],
  ['¿Red social del pajarito (antes)?', 'Twitter', 'Facebook', 'Instagram', 'Snapchat', 0],
  ['¿Sistema operativo de iPhone?', 'iOS', 'Android', 'Windows', 'Symbian', 0],
  ['¿Buscador más usado?', 'Google', 'Bing', 'Yahoo', 'DuckDuckGo', 0],
  ['¿Año lanzamiento iPhone 1?', '2007', '2005', '2010', '2000', 0],
  ['¿Lenguaje web estándar?', 'HTML', 'Java', 'C++', 'Python', 0],
  ['¿CEO de Tesla?', 'Elon Musk', 'Jeff Bezos', 'Tim Cook', 'Sundar Pichai', 0],
  ['¿Qué es la nube?', 'Servidores remotos', 'Vapor de agua', 'Wifi gratis', 'Satélites', 0],
  ['¿Puerto estándar actual?', 'USB-C', 'Micro USB', 'Lightning', 'VGA', 0],
  ['¿Compañía de Windows?', 'Microsoft', 'Apple', 'IBM', 'Oracle', 0],
  ['¿Robot de inteligencia artificial?', 'IA', 'Cyborg', 'Androide', 'Bot', 0],
  ['¿Creador de Facebook?', 'Zuckerberg', 'Dorsey', 'Spiegel', 'Systrom', 0],
  ['¿Qué es RAM?', 'Memoria volátil', 'Disco duro', 'Procesador', 'Pantalla', 0],
  ['¿Marca de la manzana?', 'Apple', 'Samsung', 'Sony', 'LG', 0],
  ['¿Padre de la computación?', 'Alan Turing', 'Babbage', 'Lovelace', 'Von Neumann', 0],
  ['¿Significado de WWW?', 'World Wide Web', 'World Web Wide', 'Wide World Web', 'Web World Wide', 0],
  ['¿Creador de Linux?', 'Linus Torvalds', 'Stallman', 'Gates', 'Jobs', 0],
  ['¿Unidad de almacenamiento?', 'Byte', 'Bit', 'Hertz', 'Pixel', 0],
  ['¿Lenguaje de estilos web?', 'CSS', 'HTML', 'JS', 'PHP', 0],
  ['¿Red profesional?', 'LinkedIn', 'Tinder', 'Facebook', 'Discord', 0],
  ['¿Dueño de Instagram?', 'Meta', 'Google', 'Apple', 'Amazon', 0],
  ['¿Formato de imagen comprimido?', 'JPG', 'PNG', 'BMP', 'RAW', 0],
  ['¿Qué es un SSD?', 'Disco de estado sólido', 'Super Speed Drive', 'Solid System Data', 'Silicon Storage Disk', 0],
  ['¿Significado de GPU?', 'Graphics Processing Unit', 'General Power Unit', 'Game Play Unit', 'Global Process User', 0],
  ['¿Asistente de Amazon?', 'Alexa', 'Siri', 'Cortana', 'Google', 0],
  ['¿Navegador de Apple?', 'Safari', 'Chrome', 'Edge', 'Firefox', 0],
  ['¿Fundador de Amazon?', 'Jeff Bezos', 'Elon Musk', 'Bill Gates', 'Jack Ma', 0],
  ['¿Conexión inalámbrica corta?', 'Bluetooth', 'Wifi', 'NFC', '4G', 0],
  ['¿Resolución 4K es?', '3840x2160', '1920x1080', '1280x720', '7680x4320', 0],
  ['¿Símbolo de Python?', 'Serpiente', 'Café', 'Elefante', 'Diamante', 0],
  ['¿Qué es un Bug?', 'Error de software', 'Insecto real', 'Virus', 'Hacker', 0],
  ['¿Red de videos cortos?', 'TikTok', 'Vine', 'YouTube', 'Vimeo', 0],
  ['¿Protocolo seguro web?', 'HTTPS', 'HTTP', 'FTP', 'SMTP', 0],
  ['¿Marca coreana de móviles?', 'Samsung', 'Xiaomi', 'Sony', 'Nokia', 0]
];

const DB_SPACE: CompactQ[] = [
  ['¿Planeta más grande?', 'Júpiter', 'Saturno', 'Sol', 'Tierra', 0],
  ['¿Satélite natural de la Tierra?', 'Luna', 'Fobos', 'Europa', 'Titán', 0],
  ['¿Estrella del sistema solar?', 'Sol', 'Sirio', 'Alpha Centauri', 'Betelgeuse', 0],
  ['¿Primer hombre en la luna?', 'Neil Armstrong', 'Buzz Aldrin', 'Yuri Gagarin', 'Michael Collins', 0],
  ['¿Planeta con anillos visibles?', 'Saturno', 'Urano', 'Neptuno', 'Marte', 0],
  ['¿Agencia espacial de USA?', 'NASA', 'ESA', 'Roscosmos', 'JAXA', 0],
  ['¿Galaxia donde vivimos?', 'Vía Láctea', 'Andrómeda', 'Triángulo', 'Sombrero', 0],
  ['¿Planeta más cercano al sol?', 'Mercurio', 'Venus', 'Tierra', 'Marte', 0],
  ['¿Fuerza que nos mantiene al suelo?', 'Gravedad', 'Magnetismo', 'Fricción', 'Inercia', 0],
  ['¿Color del sol (real)?', 'Blanco', 'Amarillo', 'Rojo', 'Naranja', 0],
  ['¿Planeta enano?', 'Plutón', 'Ceres', 'Eris', 'Makemake', 0],
  ['¿Telescopio famoso?', 'Hubble', 'Galileo', 'Kepler', 'Webb', 0],
  ['¿Teoría origen del universo?', 'Big Bang', 'Cuerdas', 'Estacionario', 'Inflación', 0],
  ['¿Primer animal en el espacio?', 'Laika', 'Ham', 'Félicette', 'Belka', 0],
  ['¿Capas de gas de un planeta?', 'Atmósfera', 'Litósfera', 'Hidrósfera', 'Núcleo', 0],
  ['¿Planeta gemelo de la Tierra?', 'Venus', 'Marte', 'Júpiter', 'Mercurio', 0],
  ['¿Qué es un agujero negro?', 'Región de gravedad infinita', 'Estrella muerta fría', 'Planeta oscuro', 'Cometa gigante', 0],
  ['¿Estrella más brillante noche?', 'Sirio', 'Canopus', 'Vega', 'Betelgeuse', 0],
  ['¿Cuántos planetas hay (SS)?', '8', '9', '7', '10', 0],
  ['¿Roca espacial que entra atm?', 'Meteorito', 'Asteroide', 'Cometa', 'Estrella fugaz', 0],
  ['¿Primer satélite artificial?', 'Sputnik 1', 'Explorer 1', 'Vanguard', 'Telstar', 0],
  ['¿Planeta más caliente?', 'Venus', 'Mercurio', 'Marte', 'Júpiter', 0],
  ['¿Galaxia más cercana?', 'Andrómeda', 'Triángulo', 'Nubes Magallanes', 'Centaurus', 0],
  ['¿Lunas de Marte?', 'Fobos y Deimos', 'Io y Europa', 'Titán y Rea', 'Luna y Caronte', 0],
  ['¿Mancha Roja está en?', 'Júpiter', 'Saturno', 'Marte', 'Sol', 0],
  ['¿Misión Apolo famosa?', 'Apolo 11', 'Apolo 13', 'Apolo 1', 'Apolo 17', 0],
  ['¿Ciencia que estudia astros?', 'Astronomía', 'Astrología', 'Cosmología', 'Geología', 0],
  ['¿Un año luz mide?', 'Distancia', 'Tiempo', 'Velocidad', 'Luz', 0],
  ['¿Fase luna no visible?', 'Luna Nueva', 'Luna Llena', 'Cuarto Creciente', 'Cuarto Menguante', 0],
  ['¿Constelación del cazador?', 'Orión', 'Osa Mayor', 'Casiopea', 'Escorpio', 0],
  ['¿Centro del agujero negro?', 'Singularidad', 'Horizonte', 'Disco', 'Chorro', 0],
  ['¿Planeta de costado?', 'Urano', 'Neptuno', 'Saturno', 'Júpiter', 0],
  ['¿Empresa espacial de Musk?', 'SpaceX', 'Blue Origin', 'Virgin Galactic', 'Boeing', 0],
  ['¿Vehículo explorador en Marte?', 'Rover', 'Lander', 'Orbiter', 'Shuttle', 0],
  ['¿Estación Espacial?', 'ISS', 'Mir', 'Skylab', 'Tiangong', 0]
];

const DB_FOOD: CompactQ[] = [
  ['¿Ingrediente base del sushi?', 'Arroz', 'Pescado', 'Alga', 'Vinagre', 0],
  ['¿País de la pizza?', 'Italia', 'USA', 'Francia', 'Grecia', 0],
  ['¿Fruta amarilla curva?', 'Banana', 'Manzana', 'Pera', 'Naranja', 0],
  ['¿Bebida de uva fermentada?', 'Vino', 'Cerveza', 'Vodka', 'Whisky', 0],
  ['¿Principal ingrediente del guacamole?', 'Aguacate', 'Tomate', 'Cebolla', 'Limón', 0],
  ['¿Salsa roja italiana?', 'Marinara', 'Alfredo', 'Pesto', 'Carbonara', 0],
  ['¿Carne de la hamburguesa clásica?', 'Res', 'Pollo', 'Cerdo', 'Pescado', 0],
  ['¿Postre frío de leche?', 'Helado', 'Gelatina', 'Flan', 'Pastel', 0],
  ['¿Pan típico de Francia?', 'Baguette', 'Ciabatta', 'Pita', 'Naan', 0],
  ['¿Sabor del limón?', 'Ácido', 'Dulce', 'Salado', 'Amargo', 0],
  ['¿Plato nacional de España?', 'Paella', 'Tacos', 'Sushi', 'Curry', 0],
  ['¿Qué es el Tofu?', 'Queso de soja', 'Carne', 'Hongo', 'Pasta', 0],
  ['¿Bebida con cafeína?', 'Café', 'Leche', 'Jugo', 'Agua', 0],
  ['¿Especia más cara?', 'Azafrán', 'Canela', 'Pimienta', 'Vainilla', 0],
  ['¿Comida rápida de salchicha?', 'Hot Dog', 'Burger', 'Taco', 'Nugget', 0],
  ['¿País del Sushi?', 'Japón', 'China', 'Corea', 'Tailandia', 0],
  ['¿Queso con agujeros?', 'Emmental', 'Cheddar', 'Mozzarella', 'Gouda', 0],
  ['¿Fruta prohibida (Biblia)?', 'Manzana', 'Pera', 'Uva', 'Higo', 0],
  ['¿Principal ingrediente del Hummus?', 'Garbanzos', 'Lentejas', 'Frijoles', 'Guisantes', 0],
  ['¿Bebida nacional de Rusia?', 'Vodka', 'Whisky', 'Ron', 'Tequila', 0],
  ['¿Chocolate viene del...?', 'Cacao', 'Café', 'Coco', 'Vainilla', 0],
  ['¿Sopa fría española?', 'Gazpacho', 'Fabada', 'Cocido', 'Ajiaco', 0],
  ['¿Pasta en forma de lazo?', 'Farfalle', 'Penne', 'Spaghetti', 'Ravioli', 0],
  ['¿Plato de pescado crudo peruano?', 'Ceviche', 'Tiradito', 'Sushi', 'Tartar', 0],
  ['¿Tequila es de...?', 'México', 'España', 'Colombia', 'Perú', 0],
  ['¿Croissant es de origen...?', 'Austriaco (Viena)', 'Francés', 'Belga', 'Suizo', 0],
  ['¿Vitamina de la naranja?', 'C', 'A', 'D', 'B12', 0],
  ['¿Queso de la pizza?', 'Mozzarella', 'Parmesano', 'Roquefort', 'Cheddar', 0],
  ['¿Carne de cerdo curada española?', 'Jamón Serrano', 'Salami', 'Prosciutto', 'Pepperoni', 0],
  ['¿Arroz italiano cremoso?', 'Risotto', 'Paella', 'Biryani', 'Pilaf', 0],
  ['¿Salsa verde de albahaca?', 'Pesto', 'Boloñesa', 'Carbonara', 'Alfredo', 0],
  ['¿Fruto seco de la Nutella?', 'Avellana', 'Nuez', 'Almendra', 'Cacahuete', 0],
  ['¿Bebida de los piratas?', 'Ron', 'Cerveza', 'Vino', 'Agua', 0],
  ['¿Huevo de pez costoso?', 'Caviar', 'Tofu', 'Trufa', 'Foie', 0],
  ['¿Comida típica mexicana?', 'Tacos', 'Sushi', 'Pasta', 'Curry', 0]
];

const DB_SPORTS: CompactQ[] = [
  ['¿Rey del fútbol?', 'Pelé', 'Maradona', 'Messi', 'CR7', 0],
  ['¿Deporte de Michael Jordan?', 'Baloncesto', 'Fútbol', 'Tenis', 'Golf', 0],
  ['¿Evento deportivo cada 4 años?', 'Juegos Olímpicos', 'Super Bowl', 'Wimbledon', 'Tour Francia', 0],
  ['¿Cuántos jugadores en fútbol?', '11', '10', '9', '12', 0],
  ['¿Trofeo del mundial de fútbol?', 'Copa del Mundo', 'Champions', 'Libertadores', 'Eurocopa', 0],
  ['¿Deporte con raqueta y red?', 'Tenis', 'Golf', 'Fútbol', 'Rugby', 0],
  ['¿País creador del fútbol?', 'Inglaterra', 'Brasil', 'Alemania', 'Francia', 0],
  ['¿Color tarjeta expulsión?', 'Roja', 'Amarilla', 'Azul', 'Verde', 0],
  ['¿Superficie de Roland Garros?', 'Tierra batida', 'Césped', 'Dura', 'Moqueta', 0],
  ['¿Máxima puntuación en basket?', '3 puntos', '2 puntos', '1 punto', '5 puntos', 0],
  ['¿Deporte de combate con guantes?', 'Boxeo', 'Judo', 'Karate', 'Lucha', 0],
  ['¿Carrera de 42 km?', 'Maratón', 'Sprint', 'Triatlón', 'Relevos', 0],
  ['¿Mejor nadador historia?', 'Michael Phelps', 'Spitz', 'Thorpe', 'Lochte', 0],
  ['¿Deporte en el agua con tabla?', 'Surf', 'Natación', 'Waterpolo', 'Buceo', 0],
  ['¿Equipo fútbol FCB?', 'Barcelona', 'Madrid', 'Bayern', 'Boca', 0],
  ['¿Qué se golpea en Golf?', 'Bola', 'Disco', 'Puck', 'Balón', 0],
  ['¿Duración partido fútbol?', '90 min', '60 min', '80 min', '100 min', 0],
  ['¿Deporte Super Bowl?', 'Fútbol Americano', 'Rugby', 'Béisbol', 'Hockey', 0],
  ['¿Usain Bolt es...', 'Velocista', 'Nadador', 'Saltador', 'Lanzador', 0],
  ['¿Torneo tenis Londres?', 'Wimbledon', 'US Open', 'Roland Garros', 'Aus Open', 0],
  ['¿Deporte con bate?', 'Béisbol', 'Críquet', 'Golf', 'Hockey', 0],
  ['¿Color anillo olímpico falta? Azul, Negro, Rojo, Amarillo y...', 'Verde', 'Blanco', 'Naranja', 'Morado', 0],
  ['¿Artes marciales mixtas?', 'MMA', 'WWE', 'Boxeo', 'Judo', 0],
  ['¿País con más mundiales fútbol?', 'Brasil', 'Alemania', 'Italia', 'Argentina', 0],
  ['¿Deporte sobre hielo?', 'Hockey', 'Polo', 'Tenis', 'Fútbol', 0],
  ['¿Tour de Francia es de...', 'Ciclismo', 'Autos', 'Correr', 'Nadar', 0],
  ['¿Puntos Touchdown?', '6', '3', '7', '2', 0],
  ['¿Muhammad Ali era...', 'Boxeador', 'Luchador', 'Karateca', 'Judoca', 0],
  ['¿NBA significa?', 'National Basketball Association', 'National Ball Asoc', 'New Basket Area', 'North Basket American', 0],
  ['¿Deporte de Tiger Woods?', 'Golf', 'Tenis', 'Fórmula 1', 'Fútbol', 0],
  ['¿Haka es danza de...', 'Rugby (All Blacks)', 'Fútbol', 'Cricket', 'Basket', 0],
  ['¿Mejor gimnasta USA reciente?', 'Simone Biles', 'Comaneci', 'Retton', 'Douglas', 0],
  ['¿Deporte raqueta pared?', 'Squash', 'Tenis', 'Bádminton', 'Ping Pong', 0],
  ['¿Estilo de natación?', 'Mariposa', 'Abeja', 'Delfín', 'Tiburón', 0],
  ['¿FIFA sede en...', 'Suiza', 'Francia', 'USA', 'Alemania', 0]
];

const DB_OCEAN: CompactQ[] = [
  ['¿Océano más grande?', 'Pacífico', 'Atlántico', 'Índico', 'Ártico', 0],
  ['¿Animal más grande del mundo?', 'Ballena Azul', 'Tiburón Blanco', 'Elefante', 'Calamar Gigante', 0],
  ['¿Pez payaso famoso?', 'Nemo', 'Dory', 'Marlin', 'Bubbles', 0],
  ['¿Estructura viva más grande?', 'Gran Barrera de Coral', 'Amazonas', 'Everest', 'Muralla China', 0],
  ['¿Depredador marino famoso?', 'Tiburón', 'Delfín', 'Atún', 'Salmón', 0],
  ['¿Porcentaje agua en la Tierra?', '70%', '50%', '30%', '90%', 0],
  ['¿Fosa más profunda?', 'Marianas', 'Tonga', 'Japón', 'Puerto Rico', 0],
  ['¿Mamífero marino inteligente?', 'Delfín', 'Tiburón', 'Pulpo', 'Medusa', 0],
  ['¿Qué producen las ostras?', 'Perlas', 'Oro', 'Coral', 'Sal', 0],
  ['¿Marea causada por...?', 'La Luna', 'El Sol', 'El Viento', 'Las Olas', 0],
  ['¿Animal con 8 tentáculos?', 'Pulpo', 'Calamar', 'Medusa', 'Cangrejo', 0],
  ['¿Pez que nada contracorriente?', 'Salmón', 'Trucha', 'Atún', 'Sardina', 0],
  ['¿Barco hundido por iceberg?', 'Titanic', 'Olimpic', 'Britannic', 'Carpathia', 0],
  ['¿Mar con mayor salinidad?', 'Mar Muerto', 'Mediterráneo', 'Caribe', 'Rojo', 0],
  ['¿Rey del mar (mitología)?', 'Poseidón', 'Zeus', 'Hades', 'Ares', 0],
  ['¿Pez más rápido?', 'Pez Vela', 'Atún', 'Tiburón Mako', 'Barracuda', 0],
  ['¿Cetáceo blanco y negro?', 'Orca', 'Ballena Gris', 'Cachalote', 'Delfín', 0],
  ['¿Qué respiran los peces?', 'Oxígeno (branquias)', 'Aire', 'Agua', 'Hidrógeno', 0],
  ['¿Isla de plástico está en...', 'Pacífico', 'Atlántico', 'Índico', 'Mediterráneo', 0],
  ['¿Triángulo de las...', 'Bermudas', 'Bahamas', 'Canarias', 'Azores', 0],
  ['¿Crustáceo que camina de lado?', 'Cangrejo', 'Langosta', 'Camarón', 'Percebe', 0],
  ['¿Animal con 3 corazones?', 'Pulpo', 'Ballena', 'Delfín', 'Tortuga', 0],
  ['¿Arrecife más grande?', 'Australia', 'Belice', 'Florida', 'Indonesia', 0],
  ['¿Animal inmortal?', 'Medusa Turritopsis', 'Tortuga', 'Langosta', 'Tiburón', 0],
  ['¿Mar sin costas?', 'Mar de los Sargazos', 'Mar Negro', 'Mar Rojo', 'Mar Caspio', 0],
  ['¿Titanic se hundió en...', '1912', '1900', '1920', '1898', 0],
  ['¿Pez plano?', 'Lenguado', 'Merluza', 'Salmón', 'Atún', 0],
  ['¿Corriente cálida atlántica?', 'Golfo', 'Humboldt', 'Canarias', 'Labrador', 0],
  ['¿Punto más profundo océano?', 'Abismo Challenger', 'Fosa Java', 'Fosa Tonga', 'Abismo Negro', 0],
  ['¿Mamífero que pone huevos?', 'Ornitorrinco', 'Delfín', 'Ballena', 'Foca', 0],
  ['¿Caballito de mar macho...', 'Da a luz', 'Pone huevos', 'Caza', 'No hace nada', 0],
  ['¿Monstruo marino legendario?', 'Kraken', 'Godzilla', 'Nessie', 'Megalodon', 0],
  ['¿Planta marina gigante?', 'Kelp', 'Alga roja', 'Musgo', 'Coral', 0],
  ['¿Océano más frío?', 'Ártico', 'Antártico', 'Pacífico', 'Atlántico', 0],
  ['¿Salinidad promedio mar?', '3.5%', '10%', '1%', '50%', 0]
];

const DB_ECONOMY: CompactQ[] = [
  ['¿Moneda de USA?', 'Dólar', 'Euro', 'Libra', 'Yen', 0],
  ['¿Qué es el PIB?', 'Producto Interno Bruto', 'Plan Interno Base', 'Precio Índice Bajo', 'Producto Inversión Banco', 0],
  ['¿Bolsa de valores de NY?', 'Wall Street', 'Nasdaq', 'Dow Jones', 'Forex', 0],
  ['¿Ley básica economía?', 'Oferta y Demanda', 'Gravedad', 'Inercia', 'Relatividad', 0],
  ['¿Qué es inflación?', 'Subida de precios', 'Bajada de precios', 'Estabilidad', 'Ahorro', 0],
  ['¿Criptomoneda más famosa?', 'Bitcoin', 'Ethereum', 'Dogecoin', 'Litecoin', 0],
  ['¿Impuesto al valor añadido?', 'IVA', 'ISR', 'IEPS', 'IBI', 0],
  ['¿Institución que imprime dinero?', 'Banco Central', 'Gobierno', 'Empresas', 'Bancos', 0],
  ['¿Vender a otro país?', 'Exportar', 'Importar', 'Comprar', 'Alquilar', 0],
  ['¿Moneda de Europa?', 'Euro', 'Franco', 'Marco', 'Peseta', 0],
  ['¿Qué es bancarrota?', 'Quiebra', 'Ganancia', 'Fusión', 'Inversión', 0],
  ['¿Padre del capitalismo?', 'Adam Smith', 'Marx', 'Keynes', 'Friedman', 0],
  ['¿Metal precioso reserva?', 'Oro', 'Plata', 'Bronce', 'Cobre', 0],
  ['¿Tarjeta de crédito famosa?', 'Visa', 'Sony', 'Apple', 'Tesla', 0],
  ['¿Acción de guardar dinero?', 'Ahorrar', 'Gastar', 'Invertir', 'Prestar', 0],
  ['¿Mercado de acciones tecno?', 'Nasdaq', 'Nyse', 'Ibex', 'Dax', 0],
  ['¿Moneda de Reino Unido?', 'Libra Esterlina', 'Euro', 'Franco', 'Marco', 0],
  ['¿Periodo de baja economía?', 'Recesión', 'Auge', 'Burbuja', 'Expansión', 0],
  ['¿Autor de "El Capital"?', 'Karl Marx', 'Adam Smith', 'Ricardo', 'Keynes', 0],
  ['¿Dinero virtual?', 'Criptomoneda', 'Billete', 'Moneda', 'Cheque', 0],
  ['¿Empresa más valiosa (aprox)?', 'Apple', 'Nokia', 'Ford', 'Sony', 0],
  ['¿Quién dirige un banco central?', 'Gobernador', 'Presidente', 'CEO', 'Dueño', 0],
  ['¿Qué es el FMI?', 'Fondo Monetario Internacional', 'Fondo Mundial Inversión', 'Federación Moneda Inter', 'Finanzas Mundiales Inst', 0],
  ['¿Impuesto sobre la renta?', 'IRPF / ISR', 'IVA', 'IBI', 'Tasas', 0],
  ['¿Qué es un activo?', 'Algo que genera valor', 'Una deuda', 'Un gasto', 'Un impuesto', 0],
  ['¿Qué es un pasivo?', 'Una deuda/obligación', 'Un ingreso', 'Una inversión', 'Un ahorro', 0],
  ['¿Monopolio es...', 'Un solo vendedor', 'Muchos vendedores', 'Dos vendedores', 'Ningún vendedor', 0],
  ['¿Sede Bolsa España?', 'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 0],
  ['¿Moneda de China?', 'Yuan (Renminbi)', 'Yen', 'Won', 'Dólar', 0],
  ['¿Unicornio en negocios es...', 'Startup > 1 billón', 'Empresa falsa', 'Estafa', 'Empresa vieja', 0],
  ['¿CEO de Berkshire Hathaway?', 'Warren Buffett', 'Bezos', 'Gates', 'Musk', 0],
  ['¿Qué es deflación?', 'Bajada de precios', 'Subida de precios', 'Estancamiento', 'Inflación', 0],
  ['¿Intercambio sin dinero?', 'Trueque', 'Compra', 'Venta', 'Crédito', 0],
  ['¿Paraíso fiscal?', 'Impuestos bajos/nulos', 'Playa bonita', 'Muchos bancos', 'País rico', 0],
  ['¿Presupuesto es...', 'Plan de gastos', 'Deuda', 'Ahorro', 'Inversión', 0]
];

const DB_MYTHOLOGY: CompactQ[] = [
  ['¿Rey de los dioses griegos?', 'Zeus', 'Poseidón', 'Hades', 'Ares', 0],
  ['¿Dios del trueno nórdico?', 'Thor', 'Odin', 'Loki', 'Freya', 0],
  ['¿Héroe de la fuerza?', 'Hércules', 'Aquiles', 'Perseo', 'Teseo', 0],
  ['¿Monstruo con serpientes en pelo?', 'Medusa', 'Hidra', 'Quimera', 'Esfinge', 0],
  ['¿Dios del inframundo griego?', 'Hades', 'Zeus', 'Ares', 'Hermes', 0],
  ['¿Padre de todo nórdico?', 'Odin', 'Thor', 'Baldur', 'Tyr', 0],
  ['¿Ave que renace cenizas?', 'Fénix', 'Grifo', 'Roc', 'Harpía', 0],
  ['¿Diosa del amor?', 'Afrodita', 'Atenea', 'Hera', 'Artemisa', 0],
  ['¿Caballo con alas?', 'Pegaso', 'Unicornio', 'Centauro', 'Hipogrifo', 0],
  ['¿Arma de Thor?', 'Martillo (Mjolnir)', 'Lanza', 'Espada', 'Arco', 0],
  ['¿Dios egipcio de la muerte?', 'Anubis', 'Ra', 'Osiris', 'Horus', 0],
  ['¿Ciclope tiene...?', 'Un ojo', 'Dos ojos', 'Tres ojos', 'Cuatro ojos', 0],
  ['¿Guerra famosa griega?', 'Troya', 'Esparta', 'Atenas', 'Persia', 0],
  ['¿Caja de los males?', 'Pandora', 'Arca', 'Cofre', 'Baúl', 0],
  ['¿Dios romano del mar?', 'Neptuno', 'Júpiter', 'Marte', 'Vulcano', 0],
  ['¿Loki es dios del...', 'Engaño', 'Trueno', 'Amor', 'Sol', 0],
  ['¿Quién mató a Medusa?', 'Perseo', 'Hércules', 'Teseo', 'Aquiles', 0],
  ['¿Río del inframundo?', 'Estigia', 'Nilo', 'Amazonas', 'Jordán', 0],
  ['¿Montaña de los dioses?', 'Olimpo', 'Everest', 'Sinai', 'Fuji', 0],
  ['¿Dios del Sol egipcio?', 'Ra', 'Anubis', 'Set', 'Isis', 0],
  ['¿Valkirias sirven a...', 'Odin', 'Thor', 'Loki', 'Hela', 0],
  ['¿Martillo de Thor se llama?', 'Mjolnir', 'Stormbreaker', 'Gungnir', 'Excalibur', 0],
  ['¿Perro de tres cabezas?', 'Cerbero', 'Hidra', 'Quimera', 'Ortro', 0],
  ['¿Talón de...', 'Aquiles', 'Héctor', 'Paris', 'Ulises', 0],
  ['¿Diosa de la caza?', 'Artemisa', 'Hera', 'Deméter', 'Hestia', 0],
  ['¿Mensajero de los dioses?', 'Hermes', 'Apolo', 'Dionisio', 'Hefesto', 0],
  ['¿Quién robó el fuego?', 'Prometeo', 'Epimeteo', 'Atlas', 'Cronos', 0],
  ['¿Esposa de Zeus?', 'Hera', 'Afrodita', 'Atenea', 'Rea', 0],
  ['¿Dios del vino?', 'Dionisio', 'Apolo', 'Ares', 'Hades', 0],
  ['¿Ser mitad hombre mitad caballo?', 'Centauro', 'Minotauro', 'Sátiro', 'Sirena', 0],
  ['¿Laberinto del...', 'Minotauro', 'Ciclope', 'Dragón', 'Grifo', 0],
  ['¿Diosa de la sabiduría (romana)?', 'Minerva', 'Diana', 'Venus', 'Juno', 0],
  ['¿Fin del mundo nórdico?', 'Ragnarok', 'Apocalipsis', 'Armagedón', 'Diluvio', 0],
  ['¿Gigantes de...', 'Hielo', 'Roca', 'Fuego', 'Aire', 0],
  ['¿Rey Arturo tenía la espada...', 'Excalibur', 'Tizona', 'Joyosa', 'Durandal', 0]
];

const DB_MEDIEVAL: CompactQ[] = [
  ['¿Arma principal caballero?', 'Espada', 'Rifle', 'Pistola', 'Granada', 0],
  ['¿Vivienda fortificada?', 'Castillo', 'Casa', 'Choza', 'Iglú', 0],
  ['¿Plaga mortal medieval?', 'Peste Negra', 'Gripe', 'Viruela', 'Malaria', 0],
  ['¿Guerra religiosa?', 'Cruzada', 'Guerra Fría', 'Guerra Civil', 'Guerra Mundial', 0],
  ['¿Rey de la mesa redonda?', 'Arturo', 'Ricardo', 'Enrique', 'Carlos', 0],
  ['¿Sistema social medieval?', 'Feudalismo', 'Capitalismo', 'Comunismo', 'Democracia', 0],
  ['¿Guerrero japonés similar?', 'Samurái', 'Ninja', 'Monje', 'Vikingo', 0],
  ['¿Invasores del norte?', 'Vikingos', 'Romanos', 'Griegos', 'Persas', 0],
  ['¿Armadura hecha de?', 'Metal', 'Plástico', 'Madera', 'Tela', 0],
  ['¿Torneo a caballo?', 'Justa', 'Carrera', 'Duelo', 'Batalla', 0],
  ['¿Juana de ...?', 'Arco', 'Francia', 'Orleans', 'París', 0],
  ['¿Mago de Arturo?', 'Merlín', 'Gandalf', 'Dumbledore', 'Harry', 0],
  ['¿Imperio caído en 476?', 'Romano', 'Griego', 'Persa', 'Otomano', 0],
  ['¿Arma de asedio?', 'Catapulta', 'Tanque', 'Cañón', 'Mortero', 0],
  ['¿Libro sagrado?', 'Biblia', 'Corán', 'Torá', 'Vedas', 0],
  ['¿Código de honor samurái?', 'Bushido', 'Chivalry', 'Zen', 'Tao', 0],
  ['¿Capital Imperio Bizantino?', 'Constantinopla', 'Roma', 'Atenas', 'Alejandría', 0],
  ['¿Guerrero sagrado cristiano?', 'Templario', 'Espartano', 'Legionario', 'Jenízaro', 0],
  ['¿Mongol conquistador?', 'Genghis Khan', 'Attila', 'Kublai', 'Tamerlán', 0],
  ['¿Foso alrededor del castillo?', 'Agua', 'Fuego', 'Pinchos', 'Lava', 0],
  ['¿Arquitectura medieval?', 'Gótica', 'Moderna', 'Barroca', 'Renacentista', 0],
  ['¿Inquisición perseguía...', 'Herejes', 'Reyes', 'Soldados', 'Comerciantes', 0],
  ['¿Carlomagno era rey de...', 'Francos', 'Ingleses', 'Vikingos', 'Romanos', 0],
  ['¿Arma arrojadiza (arco)?', 'Flecha', 'Bala', 'Piedra', 'Dardo', 0],
  ['¿Año descubrimiento América?', '1492', '1400', '1500', '1350', 0],
  ['¿Guerra de los 100 años fue...', 'Francia vs Inglaterra', 'Roma vs Cartago', 'España vs Portugal', 'Rusia vs China', 0],
  ['¿Escudo de armas?', 'Heráldica', 'Bandera', 'Estandarte', 'Logo', 0],
  ['¿Monje copista escribía en...', 'Pergamino', 'Papel', 'Tablet', 'Pizarra', 0],
  ['¿Robin Hood robaba a...', 'Ricos', 'Pobres', 'Reyes', 'Monjes', 0],
  ['¿Vikingos venían de...', 'Escandinavia', 'Germania', 'Bretaña', 'Galia', 0],
  ['¿Líder musulmán cruzadas?', 'Saladino', 'Mahoma', 'Aladino', 'Suleimán', 0],
  ['¿Reconquista española terminó en...', 'Granada', 'Madrid', 'Toledo', 'Sevilla', 0],
  ['¿Cid Campeador era...', 'Rodrigo Díaz', 'Alfonso', 'Sancho', 'Fernando', 0],
  ['¿Peste venía de...', 'Ratas/Pulgas', 'Perros', 'Gatos', 'Pájaros', 0],
  ['¿Torre principal castillo?', 'Torre del Homenaje', 'Torre Eiffel', 'Torre Pisa', 'Torreón', 0]
];

const DB_CELEBS: CompactQ[] = [
  ['¿Rey del Pop?', 'Michael Jackson', 'Elvis', 'Prince', 'Bowie', 0],
  ['¿Cantante de "Baby"?', 'Justin Bieber', 'Drake', 'Weeknd', 'Eminem', 0],
  ['¿Actriz de Tomb Raider?', 'Angelina Jolie', 'Megan Fox', 'Scarlett', 'Jennifer', 0],
  ['¿Esposa de Jay-Z?', 'Beyoncé', 'Rihanna', 'Shakira', 'Adele', 0],
  ['¿Actor de Iron Man?', 'Robert Downey Jr', 'Chris Evans', 'Hemsworth', 'Pratt', 0],
  ['¿Banda de Liverpool?', 'The Beatles', 'Queen', 'Stones', 'Pink Floyd', 0],
  ['¿Cantante colombiana caderas?', 'Shakira', 'Karol G', 'Thalia', 'Paulina', 0],
  ['¿Protagonista Titanic?', 'DiCaprio', 'Pitt', 'Clooney', 'Depp', 0],
  ['¿Reina del Pop?', 'Madonna', 'Gaga', 'Britney', 'Katy', 0],
  ['¿Actor ex-luchador "The Rock"?', 'Dwayne Johnson', 'Cena', 'Bautista', 'Hogan', 0],
  ['¿Cantante de "Hello"?', 'Adele', 'Sia', 'Taylor', 'Ariana', 0],
  ['¿Esposo de Kim K (ex)?', 'Kanye West', 'Drake', 'Travis', 'Jay-Z', 0],
  ['¿Saga Harry Potter actor?', 'Daniel Radcliffe', 'Rupert', 'Emma', 'Tom', 0],
  ['¿James Bond actor?', 'Daniel Craig', 'Connery', 'Brosnan', 'Moore', 0],
  ['¿Cantante country a pop?', 'Taylor Swift', 'Miley', 'Selena', 'Demi', 0],
  ['¿Vocalista de Queen?', 'Freddie Mercury', 'Brian May', 'Bowie', 'Elton John', 0],
  ['¿Esposa de Piqué (ex)?', 'Shakira', 'Antonela', 'Georgina', 'Beckham', 0],
  ['¿Actor de Piratas Caribe?', 'Johnny Depp', 'Bloom', 'Rush', 'Bardem', 0],
  ['¿Cantante "Thriller"?', 'Michael Jackson', 'Prince', 'Stevie Wonder', 'Lionel Richie', 0],
  ['¿Banda de K-Pop famosa?', 'BTS', 'EXO', 'NCT', 'BigBang', 0],
  ['¿Girlband K-Pop?', 'Blackpink', 'Twice', 'Red Velvet', 'Aespa', 0],
  ['¿Actor Misión Imposible?', 'Tom Cruise', 'Brad Pitt', 'Keanu Reeves', 'Ford', 0],
  ['¿Cantante "Despacito"?', 'Luis Fonsi', 'Daddy Yankee', 'Maluma', 'J Balvin', 0],
  ['¿Rapero "Slim Shady"?', 'Eminem', '50 Cent', 'Snoop Dogg', 'Dr Dre', 0],
  ['¿Lady Gaga fans se llaman?', 'Little Monsters', 'Beliebers', 'Swifties', 'Army', 0],
  ['¿Actor de Joker (2019)?', 'Joaquin Phoenix', 'Heath Ledger', 'Jared Leto', 'Nicholson', 0],
  ['¿Cantante de Barbados?', 'Rihanna', 'Nicki Minaj', 'Cardi B', 'Beyonce', 0],
  ['¿Quien cantó "Material Girl"?', 'Madonna', 'Cyndi Lauper', 'Cher', 'Tina Turner', 0],
  ['¿Banda de rock australiana?', 'AC/DC', 'Metallica', 'Nirvana', 'Guns N Roses', 0],
  ['¿Actor de Thor?', 'Chris Hemsworth', 'Chris Evans', 'Chris Pratt', 'Chris Pine', 0],
  ['¿Cantante "Shape of You"?', 'Ed Sheeran', 'Justin Bieber', 'Shawn Mendes', 'Harry Styles', 0],
  ['¿Grupo de "Bohemian Rhapsody"?', 'Queen', 'Beatles', 'Stones', 'Led Zeppelin', 0],
  ['¿Jennifer Lopez es del...', 'Bronx', 'Queens', 'Brooklyn', 'Manhattan', 0],
  ['¿Actor Spider-Man actual?', 'Tom Holland', 'Tobey Maguire', 'Andrew Garfield', 'Miles Morales', 0],
  ['¿Cantante "Single Ladies"?', 'Beyoncé', 'Rihanna', 'Shakira', 'JLo', 0]
];

// --- HARDCORE POOLS (PREMIUM) ---
const DB_HARDCORE_PHYSICS: CompactQ[] = [
  ['¿Partícula de Dios?', 'Bosón de Higgs', 'Quark', 'Neutrino', 'Fotón', 0],
  ['¿Gato vivo y muerto?', 'Schrödinger', 'Heisenberg', 'Planck', 'Bohr', 0],
  ['¿Velocidad de la luz?', '300,000 km/s', '150,000 km/s', '1,000 km/s', 'Infinita', 0],
  ['¿Teoría de Einstein?', 'Relatividad', 'Gravedad', 'Cuerdas', 'Caos', 0],
  ['¿Fuerza mantiene núcleo?', 'Fuerte', 'Débil', 'Gravedad', 'Electromagnética', 0],
  ['¿Principio de Incertidumbre?', 'Heisenberg', 'Pauli', 'Bohr', 'Fermi', 0],
  ['¿Entrelazamiento cuántico?', 'Acción fantasmal', 'Telepatía', 'Gravedad', 'Fusión', 0],
  ['¿Unidad de resistencia?', 'Ohm', 'Volt', 'Ampere', 'Watt', 0],
  ['¿Cuanto es el cero absoluto?', '-273.15 C', '0 C', '-100 C', '-500 C', 0],
  ['¿Partícula sin carga?', 'Neutrón', 'Protón', 'Electrón', 'Positrón', 0],
  ['¿Antimateria del electrón?', 'Positrón', 'Antiprotón', 'Neutrino', 'Quark', 0],
  ['¿Constante de Planck?', 'h', 'c', 'G', 'k', 0],
  ['¿Teoría del todo?', 'Cuerdas', 'Relatividad', 'Cuántica', 'Gravedad', 0],
  ['¿Cuarto estado materia?', 'Plasma', 'Gas', 'Sólido', 'Líquido', 0],
  ['¿Fusión ocurre en...', 'Sol', 'Tierra', 'Luna', 'Marte', 0]
];
const DB_HARDCORE_NEURO: CompactQ[] = [
  ['¿Célula del cerebro?', 'Neurona', 'Glóbulo', 'Hepatocito', 'Osteocito', 0],
  ['¿Conexión entre neuronas?', 'Sinapsis', 'Unión', 'Puente', 'Enlace', 0],
  ['¿Lóbulo visual?', 'Occipital', 'Frontal', 'Parietal', 'Temporal', 0],
  ['¿Neurotransmisor placer?', 'Dopamina', 'Serotonina', 'GABA', 'Adrenalina', 0],
  ['¿Parte memoria?', 'Hipocampo', 'Cerebelo', 'Bulbo', 'Amígdala', 0],
  ['¿Líquido cerebroespinal?', 'LCR', 'Sangre', 'Linfa', 'Agua', 0],
  ['¿Capa externa cerebro?', 'Corteza', 'Médula', 'Ganglio', 'Núcleo', 0],
  ['¿Hemisferio lenguaje?', 'Izquierdo', 'Derecho', 'Ambos', 'Ninguno', 0],
  ['¿Nervio olfatorio es par...', 'I', 'II', 'V', 'X', 0],
  ['¿Materia gris son...', 'Somas', 'Axones', 'Grasa', 'Hueso', 0],
  ['¿Enfermedad pérdida memoria?', 'Alzheimer', 'Parkinson', 'ELA', 'Esclerosis', 0],
  ['¿Control motor fino?', 'Cerebelo', 'Tronco', 'Tálamo', 'Hipotálamo', 0],
  ['¿Barrera sangre-cerebro?', 'Hematoencefálica', 'Placentaria', 'Cutánea', 'Gástrica', 0],
  ['¿Sueño REM significa?', 'Rapid Eye Movement', 'Red Eye Mode', 'Real Energy Mind', 'Rest Easy Mode', 0],
  ['¿Células gliales?', 'Soporte', 'Ataque', 'Transporte', 'Visión', 0]
];
const DB_HARDCORE_CRYPTO: CompactQ[] = [
  ['¿Creador Bitcoin?', 'Satoshi Nakamoto', 'Vitalik', 'Charlie Lee', 'Gavin', 0],
  ['¿Tecnología base crypto?', 'Blockchain', 'Database', 'Cloud', 'AI', 0],
  ['¿Moneda de Ethereum?', 'Ether', 'Litecoin', 'Ripple', 'Doge', 0],
  ['¿Ataque 51%?', 'Control red', 'Robo', 'Phishing', 'DDoS', 0],
  ['¿Halving ocurre cada?', '4 años', '2 años', '1 año', '6 meses', 0],
  ['¿Algoritmo de Bitcoin?', 'SHA-256', 'Scrypt', 'Ethash', 'X11', 0],
  ['¿Qué es una Wallet?', 'Monedero digital', 'Banco', 'Tarjeta', 'USB', 0],
  ['¿NFT significa?', 'Non Fungible Token', 'New File Type', 'No Fee Transaction', 'Net Fun Token', 0],
  ['¿Stablecoin famosa?', 'USDT', 'BTC', 'ETH', 'DOGE', 0],
  ['¿Exchange más grande?', 'Binance', 'Coinbase', 'Kraken', 'MtGox', 0],
  ['¿Consenso de Bitcoin?', 'Proof of Work', 'Proof of Stake', 'Delegated', 'History', 0],
  ['¿Clave privada?', 'No compartir', 'Pública', 'Usuario', 'Email', 0],
  ['¿Límite suministro Bitcoin?', '21 Millones', 'Infinito', '100 Millones', '1 Billón', 0],
  ['¿Fork significa?', 'Bifurcación', 'Cuchara', 'Error', 'Actualización', 0],
  ['¿Whitepaper es?', 'Documento técnico', 'Papel blanco', 'Dinero', 'Contrato', 0]
];
const DB_HARDCORE_MATH: CompactQ[] = [
  ['¿Derivada de x^2?', '2x', 'x', '2', '0', 0],
  ['¿Número PI?', '3.14159', '3.14169', '3.15149', '3.14444', 0],
  ['¿Teorema triángulos?', 'Pitágoras', 'Tales', 'Euclides', 'Gauss', 0],
  ['¿Raíz de -1?', 'i', '1', '-1', '0', 0],
  ['¿Sucesión 1,1,2,3,5...?', 'Fibonacci', 'Bernoulli', 'Newton', 'Euler', 0],
  ['¿Ángulos triángulo suman?', '180', '360', '90', '270', 0],
  ['¿Logaritmo base e?', 'Natural (ln)', 'Base 10', 'Binario', 'Inverso', 0],
  ['¿Número áureo?', 'Phi (1.618)', 'Pi', 'e', 'Tau', 0],
  ['¿Integral inversa de...', 'Derivada', 'Suma', 'Resta', 'Límite', 0],
  ['¿Hipotenusa es lado...', 'Más largo', 'Más corto', 'Medio', 'Opuesto', 0],
  ['¿Número primo par?', '2', '4', '1', '0', 0],
  ['¿Factorial de 3 (3!)?', '6', '3', '9', '1', 0],
  ['¿Ecuación cuadrática?', 'Parábola', 'Línea', 'Círculo', 'Hipérbola', 0],
  ['¿Seno de 90 grados?', '1', '0', '-1', '0.5', 0],
  ['¿Padre de la Geometría?', 'Euclides', 'Pitágoras', 'Newton', 'Arquímedes', 0]
];
const DB_HARDCORE_PHILO: CompactQ[] = [
  ['¿"Pienso, luego existo"?', 'Descartes', 'Kant', 'Hume', 'Platón', 0],
  ['¿Mito de la caverna?', 'Platón', 'Aristóteles', 'Sócrates', 'Nietzsche', 0],
  ['¿Dios ha muerto?', 'Nietzsche', 'Hegel', 'Marx', 'Sartre', 0],
  ['¿Ética del deber?', 'Kant', 'Mill', 'Hume', 'Locke', 0],
  ['¿Autor El Príncipe?', 'Maquiavelo', 'Hobbes', 'Rousseau', 'More', 0],
  ['¿Tabula Rasa?', 'John Locke', 'Platón', 'Descartes', 'Leibniz', 0],
  ['¿Superhombre (Ubermensch)?', 'Nietzsche', 'Freud', 'Marx', 'Kant', 0],
  ['¿Solo sé que no sé nada?', 'Sócrates', 'Platón', 'Aristóteles', 'Heráclito', 0],
  ['¿Leviatán autor?', 'Hobbes', 'Locke', 'Rousseau', 'Voltaire', 0],
  ['¿Mundo de las Ideas?', 'Platón', 'Aristóteles', 'Epicuro', 'Zenón', 0],
  ['¿Existencialismo?', 'Sartre', 'Camus', 'Hegel', 'Spinoza', 0],
  ['¿Navaja de...', 'Ockham', 'Hume', 'Popper', 'Russell', 0],
  ['¿Contrato Social?', 'Rousseau', 'Hobbes', 'Locke', 'Montesquieu', 0],
  ['¿Crítica Razón Pura?', 'Kant', 'Hegel', 'Schopenhauer', 'Fichte', 0],
  ['¿Utilitarismo?', 'Mill', 'Kant', 'Aristóteles', 'Aquino', 0]
];
const DB_HARDCORE_ASTRO: CompactQ[] = [
  ['¿Horizonte de sucesos?', 'Agujero Negro', 'Sol', 'Nebulosa', 'Quasar', 0],
  ['¿Materia invisible?', 'Oscura', 'Gris', 'Negra', 'Roja', 0],
  ['¿Explosión estelar?', 'Supernova', 'Nova', 'Púlsar', 'Fusión', 0],
  ['¿Estrella de neutrones?', 'Púlsar', 'Enana', 'Gigante', 'Agujero', 0],
  ['¿Edad Universo?', '13.8 billones', '4.5 billones', '10 billones', '20 billones', 0],
  ['¿Corrimiento al rojo?', 'Expansión', 'Contracción', 'Rotación', 'Fusión', 0],
  ['¿Fondo cósmico de microondas?', 'Eco Big Bang', 'Luz solar', 'Radio', 'Ruido', 0],
  ['¿Diagrama H-R clasifica?', 'Estrellas', 'Planetas', 'Galaxias', 'Cometas', 0],
  ['¿Enana Blanca es remanente de...', 'Sol', 'Supernova', 'Agujero Negro', 'Nebulosa', 0],
  ['¿Límite de Chandrasekhar?', 'Masa máxima enana blanca', 'Velocidad luz', 'Radio agujero negro', 'Temperatura cero', 0],
  ['¿Quásar es?', 'Núcleo galáctico activo', 'Estrella', 'Planeta', 'Cometa', 0],
  ['¿Paradoja de Fermi?', '¿Dónde están todos?', 'Gato vivo muerto', 'Gemelos', 'Abuelo', 0],
  ['¿Energía Oscura causa...', 'Aceleración expansión', 'Gravedad', 'Luz', 'Calor', 0],
  ['¿Espaguetización ocurre en...', 'Agujero Negro', 'Sol', 'Tierra', 'Neutrones', 0],
  ['¿Laniakea es nuestro...', 'Supercúmulo', 'Galaxia', 'Sistema', 'Planeta', 0]
];
const DB_HARDCORE_BIO: CompactQ[] = [
  ['¿Molécula de la vida?', 'ADN', 'ARN', 'ATP', 'Proteína', 0],
  ['¿Energía celular?', 'ATP', 'ADP', 'GTP', 'NADH', 0],
  ['¿Ciclo metabólico?', 'Krebs', 'Calvin', 'Urea', 'Cori', 0],
  ['¿Enzima rompe proteínas?', 'Proteasa', 'Lipasa', 'Amilasa', 'Nucleasa', 0],
  ['¿Base nitrogenada ADN?', 'Timina', 'Uracilo', 'Ribosa', 'Sulfuro', 0],
  ['¿Dogma Central?', 'ADN->ARN->Proteína', 'ARN->ADN->Proteína', 'Proteína->ADN', 'ADN->Grasa', 0],
  ['¿Mitocondria función?', 'Energía', 'Digestión', 'Protección', 'División', 0],
  ['¿Ribosoma hace?', 'Proteínas', 'Lípidos', 'Azúcar', 'ADN', 0],
  ['¿CRISPR es para...', 'Editar genes', 'Clonar', 'Cultivar', 'Ver células', 0],
  ['¿Célula sin núcleo?', 'Procariota', 'Eucariota', 'Vegetal', 'Animal', 0],
  ['¿Fotosíntesis ocurre en...', 'Cloroplasto', 'Mitocondria', 'Núcleo', 'Vacuola', 0],
  ['¿Aminoácidos forman...', 'Proteínas', 'Grasas', 'Azúcares', 'ADN', 0],
  ['¿Codón de inicio?', 'AUG', 'UAA', 'UAG', 'UGA', 0],
  ['¿PCR sirve para...', 'Amplificar ADN', 'Cortar ADN', 'Pegar ADN', 'Ver ADN', 0],
  ['¿Grupo sanguíneo universal?', 'O negativo', 'AB positivo', 'A positivo', 'B negativo', 0]
];
const DB_HARDCORE_ART: CompactQ[] = [
  ['¿Autor Guernica?', 'Picasso', 'Dalí', 'Miró', 'Goya', 0],
  ['¿Estilo de Monet?', 'Impresionismo', 'Cubismo', 'Realismo', 'Barroco', 0],
  ['¿Capilla Sixtina?', 'Miguel Ángel', 'Rafael', 'Donatello', 'Bernini', 0],
  ['¿La noche estrellada?', 'Van Gogh', 'Munch', 'Klimt', 'Renoir', 0],
  ['¿Relojes derretidos?', 'Dalí', 'Magritte', 'Kahlo', 'Rivera', 0],
  ['¿El Grito autor?', 'Munch', 'Klimt', 'Warhol', 'Monet', 0],
  ['¿David de Miguel Ángel es de...', 'Mármol', 'Bronce', 'Madera', 'Yeso', 0],
  ['¿Venus de Milo no tiene...', 'Brazos', 'Cabeza', 'Piernas', 'Nariz', 0],
  ['¿Museo del Louvre está en...', 'París', 'Londres', 'Roma', 'NY', 0],
  ['¿Técnica pintura al agua?', 'Acuarela', 'Óleo', 'Temple', 'Fresco', 0],
  ['¿Frida Kahlo era...', 'Mexicana', 'Española', 'Italiana', 'Cubana', 0],
  ['¿Andy Warhol estilo?', 'Pop Art', 'Cubismo', 'Surrealismo', 'Dadaísmo', 0],
  ['¿Las Meninas pintor?', 'Velázquez', 'Goya', 'Greco', 'Murillo', 0],
  ['¿Escuela de Atenas autor?', 'Rafael', 'Da Vinci', 'Miguel Ángel', 'Donatello', 0],
  ['¿Bosco pintó...', 'Jardín Delicias', 'Guernica', 'Gioconda', 'Grito', 0]
];

// Combine all standard for fallback/filling
const ALL_STANDARD = [
  ...DB_CARS, ...DB_GENERAL, ...DB_GAMING, ...DB_TECH, ...DB_SPACE, 
  ...DB_FOOD, ...DB_SPORTS, ...DB_OCEAN, ...DB_ECONOMY, ...DB_MYTHOLOGY, 
  ...DB_MEDIEVAL, ...DB_CELEBS
];

export const getQuestionsFromDB = (themeId: string, level: number): Question[] => {
  let pool: CompactQ[] = [];

  // 1. Select the correct pool based on themeId
  switch (themeId) {
    case 'cars': pool = DB_CARS; break;
    case 'general': pool = DB_GENERAL; break;
    case 'gaming': pool = DB_GAMING; break;
    case 'tech': pool = DB_TECH; break;
    case 'space': pool = DB_SPACE; break;
    case 'food': pool = DB_FOOD; break;
    case 'sports': pool = DB_SPORTS; break;
    case 'ocean': pool = DB_OCEAN; break;
    case 'economy': pool = DB_ECONOMY; break;
    case 'mythology': pool = DB_MYTHOLOGY; break;
    case 'medieval': pool = DB_MEDIEVAL; break;
    case 'celebs': pool = DB_CELEBS; break;
    
    // Hardcore
    case 'quantum': pool = DB_HARDCORE_PHYSICS; break;
    case 'neuro': pool = DB_HARDCORE_NEURO; break;
    case 'crypto': pool = DB_HARDCORE_CRYPTO; break;
    case 'adv_math': pool = DB_HARDCORE_MATH; break;
    case 'philosophy': pool = DB_HARDCORE_PHILO; break;
    case 'astrophys': pool = DB_HARDCORE_ASTRO; break;
    case 'bio_chem': pool = DB_HARDCORE_BIO; break;
    case 'art_hist': pool = DB_HARDCORE_ART; break;
    
    default: pool = DB_GENERAL;
  }

  // 2. Logic to ensure we have enough questions
  let selected: CompactQ[] = [];
  
  // Clone the pool so we can pop from it
  let available = [...pool];
  
  // If pool is too small, fill with generic challenging questions or repeat
  if (available.length < 12) {
     const fillers = shuffle(ALL_STANDARD).slice(0, 12 - available.length);
     available = [...available, ...fillers];
  }

  // Shuffle available questions
  available = shuffle(available);

  // Take 12
  selected = available.slice(0, 12);
  
  // Just in case we still don't have 12 (very unlikely), repeat existing
  while (selected.length < 12) {
    selected.push(selected[0]); // Repeat first
  }

  return expandQs(selected, themeId, level);
};
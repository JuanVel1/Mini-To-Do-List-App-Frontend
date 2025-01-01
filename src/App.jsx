import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const API_URL = import.meta.env.VITE_API_URL;
const TareaIndividual = ({ tarea, completarTarea, eliminarTarea }) => {
  return (
    <div>
      <div>
        <input
          type="checkbox"
          checked={tarea?.completada}
          onChange={() => completarTarea(tarea?.id)}
          aria-label="Marcar tarea como completada"
          id={`checkbox-tarea-${tarea?.id}`}
        />
        <p style={{ textDecoration: tarea?.completada ? 'line-through' : 'none' }}>
          {tarea?.task}
        </p>
      </div>
      <button
        onClick={() => eliminarTarea(tarea?.id)}
        aria-label="Eliminar tarea"
        className="eliminar-tarea"
      >
        Eliminar
      </button>
    </div>
  );
};

const ListaTareas = ({ tareas, completarTarea, eliminarTarea }) => {

  return (
    <div>
      {tareas.map((tarea) => (
        <TareaIndividual key={tarea.id} tarea={tarea} completarTarea={completarTarea} eliminarTarea={eliminarTarea} />
      ))}
    </div>
  );
};

const FormularioTarea = ({ agregarTarea }) => {
  const [texto, setTexto] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    agregarTarea(texto);
    setTexto('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" className="input-tarea" id='input-tarea' value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Ingrese una tarea" style={{ marginBottom: "1rem", height: "2rem", border: "none" }} />
      <button type="submit">Agregar</button>
    </form>
  );
};

const Ayuda = ({ mostrarAyuda, toggleAyuda }) => {
  return (
    <div style={{ display: mostrarAyuda ? 'block' : 'none' }}>
      <h2>Ayuda</h2>
      <p>Esta aplicación permite agregar, completar y eliminar tareas.</p>
      <p>Para agregar una tarea, ingrese el texto en el campo de texto y haga clic en el botón <b style={{ color: "var(--yellow) !important" }}>Agregar</b></p>
      <p>Para completar una tarea, haga clic en la casilla de verificación junto a la tarea.</p>
      <p>Para eliminar una tarea, haga clic en el botón <b>Eliminar</b> junto a la tarea.</p>
      <button onClick={toggleAyuda}>Cerrar ayuda</button>
    </div>
  );
};

const App = () => {
  const puerto = import.meta.env.VITE_PORT;
  const [tareas, setTareas] = useState([
  ]);

  useEffect(() => {
    
    fetch(`${API_URL}/todos`)
      .then((response) => response.json())
      .then((data) => setTareas(data))
      .catch((error) => console.error('Error al cargar tareas:', error));
  }, [puerto]);

  const [mostrarAyuda, setMostrarAyuda] = useState(false);

  const agregarTarea = (texto) => {
    setTareas([...tareas, { id: tareas.length + 1, task: texto, completada: false }]);
    fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ task: texto })
    });
  };

  const completarTarea = (id) => {
    setTareas(tareas.map((tarea) => (tarea.id == id ? { ...tarea, completada: !tarea.completada } : tarea)));
    fetch(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ completada: !tareas.completada })
    });
  };

  const eliminarTarea = (id) => {
    setTareas(tareas.filter((tarea) => tarea.id !== id));
    fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
    });
  };

  const toggleAyuda = () => {
    setMostrarAyuda(!mostrarAyuda);
  };

  return (
    <div>
      <h1>Lista de Tareas</h1>
      <p className="version">Versión 1.0</p>
      <p>hecho por <a href="https://github.com/JuanVel1" target="_blank" rel="noopener noreferrer">Juan Velasquez</a></p>
      <button className="mostrar-ayuda" onClick={toggleAyuda} >Mostrar ayuda</button>
      <Ayuda mostrarAyuda={mostrarAyuda} toggleAyuda={toggleAyuda} />
      <FormularioTarea agregarTarea={agregarTarea} />
      <ListaTareas tareas={tareas} completarTarea={completarTarea} eliminarTarea={eliminarTarea} />
    </div>
  );
};

export default App;

TareaIndividual.propTypes = {
  tarea: PropTypes.object.isRequired,
  completarTarea: PropTypes.func.isRequired,
  eliminarTarea: PropTypes.func.isRequired,
};

ListaTareas.propTypes = {
  tareas: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      task: PropTypes.string,
      completada: PropTypes.bool
    })
  ).isRequired,
  completarTarea: PropTypes.func.isRequired,
  eliminarTarea: PropTypes.func.isRequired
};

FormularioTarea.propTypes = {
  agregarTarea: PropTypes.func
};

Ayuda.propTypes = {
  mostrarAyuda: PropTypes.bool,
  toggleAyuda: PropTypes.func
};

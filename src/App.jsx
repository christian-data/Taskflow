
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [tarefas, setTarefas] = useState(() => {
  const tarefasGuardadas = localStorage.getItem('tarefas')

  if (tarefasGuardadas !== null) {
    return JSON.parse(tarefasGuardadas)
  }
  return []
})

  const [novaTarefa, setNovaTarefa] = useState('')
  const [filtro, setFiltro] = useState('todas')
  const [idEmEdicao, setIdEmEdicao] = useState(null)
  const [textoEdicao, setTextoEdicao] = useState('')
  useEffect(() => {
  localStorage.setItem('tarefas', JSON.stringify(tarefas))
}, [tarefas])
  
function adicionarTarefa() {
  if (novaTarefa.trim() === '') {
    return
  }

  const tarefa = {
    id: crypto.randomUUID(),
    texto: novaTarefa.trim(),
    concluida: false
  }

  setTarefas([...tarefas, tarefa])
  setNovaTarefa('')
}

function concluirTarefa(id) {
  const tarefasAtualizadas = tarefas.map((tarefa) => {
    if (tarefa.id === id) {
      return {
        ...tarefa,
        concluida: !tarefa.concluida
      }
    }
    return tarefa
  })

  setTarefas(tarefasAtualizadas)
}

function eliminarTarefa(id) {
  const confirmar = window.confirm(
    'Tens a certeza de que queres eliminar esta tarefa?'
  )

  if (!confirmar) {
    return
  }

  const tarefasAtualizadas = tarefas.filter(
    (tarefa) => tarefa.id !== id
  )

  setTarefas(tarefasAtualizadas)
}

function iniciarEdicao(tarefa) {
  setIdEmEdicao(tarefa.id)
  setTextoEdicao(tarefa.texto)
}
function cancelarEdicao() {
  setIdEmEdicao(null)
  setTextoEdicao('')
}
function guardarEdicao() {
  if (textoEdicao.trim() === '') {
    return
  }

  const tarefasAtualizadas = tarefas.map((tarefa) => {
    if (tarefa.id === idEmEdicao) {
      return {
        ...tarefa,
        texto: textoEdicao.trim()
      }
    }

    return tarefa
  })

  setTarefas(tarefasAtualizadas)
  setIdEmEdicao(null)
  setTextoEdicao('')
}
const totalTarefas = tarefas.length

const tarefasConcluidas = tarefas.filter(
  (tarefa) => tarefa.concluida
).length

const tarefasPendentes = tarefas.filter(
  (tarefa) => !tarefa.concluida
).length

const tarefasFiltradas = tarefas.filter((tarefa) => {
  if (filtro === 'pendentes') {
    return !tarefa.concluida
    
  }

  return true
})
  return (
    <div>
      <h1>TaskFlow</h1>
      <p>
        Organiza as tuas tarefas de forma simples e eficiente.
      </p>
     <div className="formulario-tarefa">
  <input
  type="text"
  placeholder="Escreve uma nova tarefa"
  value={novaTarefa}
  onChange={(evento) => setNovaTarefa(evento.target.value)}
  onKeyDown={(evento) => {
    if (evento.key === 'Enter') {
      adicionarTarefa()
    }
  }}
/>

  <button onClick={adicionarTarefa}>
    Adicionar tarefa
  </button>
  </div>
      <h2>As minhas tarefas</h2>
      <div className="contadores">
  <div className="contador total">
    <strong>{totalTarefas}</strong>
    <span>Total</span>
  </div>

  <div className="contador pendentes">
    <strong>{tarefasPendentes}</strong>
    <span>Pendentes</span>
  </div>

  <div className="contador concluidas">
    <strong>{tarefasConcluidas}</strong>
    <span>Concluídas</span>
  </div>
</div>
      <div className="filtros">
    <button
      className={filtro === 'todas' ? 'ativo' : ''}
      onClick={() => setFiltro('todas')}
    >
      Todas
    </button>

    <button
      className={filtro === 'pendentes' ? 'ativo' : ''}
      onClick={() => setFiltro('pendentes')}
    >
      Pendentes
    </button>

    <button
      className={filtro === 'concluidas' ? 'ativo' : ''}
      onClick={() => setFiltro('concluidas')}
    >
      Concluídas
    </button>
      </div>
      {tarefasFiltradas.length === 0 && (
  <p className="mensagem-vazia">
    Nenhuma tarefa encontrada.
  </p>
)}
<ul>
  {tarefasFiltradas.map((tarefa) => (
    <li key={tarefa.id}>
      <label>
      
      <input
        type="checkbox"
        checked={tarefa.concluida}
        onChange={() => concluirTarefa(tarefa.id)}
      />

  {idEmEdicao === tarefa.id ? (
      <input
        type="text"
        value={textoEdicao}
        onChange={(evento) => setTextoEdicao(evento.target.value)}
      />
    ) : (
      <span
        style={{
          textDecoration: tarefa.concluida
            ? 'line-through'
            : 'none'
        }}
      >
        {tarefa.texto}
      </span>
    )}
      </label>
      
      <div className="acoes-tarefa">
  {idEmEdicao === tarefa.id ? (
  <>
    <button
      className="btn-editar"
      onClick={guardarEdicao}
    >
      Guardar
    </button>

    <button
      className="btn-cancelar"
      onClick={cancelarEdicao}
    >
      Cancelar
    </button>
  </>
) : (

    <button
      className="btn-editar"
      onClick={() => iniciarEdicao(tarefa)}
    >
      Editar
    </button>
  )}

  <button
    className="btn-eliminar"
    onClick={() => eliminarTarefa(tarefa.id)}
  >
    Eliminar
  </button>
</div>
    </li>
  ))}
</ul>

    </div>
  )
}

export default App


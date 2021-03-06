import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router';

function ListaJugadoresPartido(){
    const [campeonato, setCampeonato] = useState('-1');
    const[partido,setPartido] = useState('-1');
    const [campeonatos, setCampeonatos] = useState([]);
    const [club, setClub] = useState('0');
    const [clubes,setClubes] = useState([]);
    const[partidos,setPartidos] = useState([]);
    const [partidoConEquipos,setPartidosConEquipos] = useState([]);
    const [jugadores,setJugadores] = useState([]);
    const [miembros, setMiembros] = useState([]);
    const [jugadoresDisponibles, setJugadoresDisponibles] = useState([]);
    const [jugadorDisponible, setJugadorDisponible] = useState("-1");
    const [jugadoresDetalles,setJugadoresDetalles] = useState([]);
    let params = useParams();

    useEffect(()=>{
        const fetchData = async () => {
            const campeonatosAPI = await axios('http://localhost:8080/obtenerCampeonatos');
            setCampeonatos(campeonatosAPI.data);

            const clubAPI = await axios('http://localhost:8080/getClubPorIdRepresentante?idRepresentante='+params.idPersona);
            setClub(clubAPI.data);
            
        };
        fetchData();
    },[])

    useEffect (() => {
        setPartidos([]);
        setPartidosConEquipos([]);
        axios.get('http://localhost:8080/getPartidosByCampeonato?idCampeonato='+campeonato)
            .then(response => {
                setPartidos(response.data);
                
            })
    },[campeonato])

    useEffect(() => { 
        
        partidos.map( async part => {
            axios.get("http://localhost:8080/getClubPorId?idClub="+part.local)
                .then(localResponse => {
                        axios.get("http://localhost:8080/getClubPorId?idClub="+part.visitante)
                            .then(visitanteResponse => {
                                let nuevo = {
                                    partido : part,
                                    clubL: localResponse.data,
                                    clubV:visitanteResponse.data
                                }
                                setPartidosConEquipos(partidoConEquipos => ([...partidoConEquipos,nuevo]));
                                
                            })
                })
        })
    },[partidos])

    useEffect(() => {
        axios.get("http://localhost:8080/obtenerJugadoresPartido?idPartido="+partido)
            .then(res => {
                setMiembros(res.data);
                
            })
        axios.get("http://localhost:8080/getJugadorAgregarAPartido?idCampeonato="+campeonato+"&idPartido="+partido+"&idClub="+club.idClub)
            .then(response => {
                setJugadoresDisponibles(response.data); 
                
            })
    },[partido,club])

    useEffect(() => {
        if (miembros && miembros.map) {
            miembros.map(miembro => {
                axios.get("http://localhost:8080/getJugadorPorId?idJugador="+miembro.idJugador)
                    .then(response2 => {
                        if (response2.data.idClub == club.idClub){
                            setJugadores(jugadores => ([...jugadores, response2.data]));
                        }
                        
                        
                    })
            })
        }
    },[miembros])

    useEffect(() => {
        jugadoresDisponibles.map(async jugador => {
            await axios.get("http://localhost:8080/getJugadorPorId?idJugador="+jugador.idJugador)
                    .then(res => {
                        let nuevo = {
                            jugadorTorneo: jugador,
                            jugador:res.data
                        }
                        setJugadoresDetalles(jugadoresDetalles => ([...jugadoresDetalles, nuevo]));
                        
                    })
        })

    },[jugadoresDisponibles])

    
    

    function handleCampChange(e){
        setJugadorDisponible("-1"); 
        setJugadoresDetalles([]);
        setJugadoresDisponibles([]);
        setJugadores([]);
        setMiembros([]);
        setCampeonato(e.target.value);
        const clubesAPI = axios.get('http://localhost:8080/obtenerClubesCampeonato?idCampeonato='+e.target.value)
                            .then(response => {
                                setClubes(response.data);
                                
                            });
    }

    function handlePartidoChange(e){
        setJugadorDisponible("-1"); 
        setJugadoresDetalles([]);
        setJugadoresDisponibles([]);
        setJugadores([]);
        setMiembros([]);
        setPartido(e.target.value);
    }

    function handleJugadorChange(e){
        setJugadorDisponible(e.target.value);
    }

    function handleEliminar(idJugador){

        axios.delete("http://localhost:8080/eliminarMiembro?idPartido="+partido+"&idJugador="+idJugador)
            .then(response =>{
                if(response.data !== ""){
                    return toast.error(response.data)
                }else{
                    return toast.success("Jugador eliminado con exito");
                }
            })

        setTimeout(() => {
            window.location.reload(true);
        },3000)
    }

    function handleJugadorSubmit(e){
        e.preventDefault();
        if (jugadorDisponible != -1){
            axios.post("http://localhost:8080/agregarJugadorPartido?idPartido="+partido+"&idJugador="+jugadorDisponible+"&idClub="+club.idClub)
                .then(response => {
                    if (response.data !== ""){
                        return toast.error(response.data)
                    } else {
                        return toast.success("Jugador agregado con exito");
                    }
                })

            setTimeout(() => {
                window.location.reload(true);
            },3000)
        }
    }

    return (
        <>
            <div className="container">
                <ToastContainer/>
                <div className="row">
                    <h2 className="text-center">Lista jugadores partido de {club.nombre}</h2>
                    <form>
                        <div class="col-sm-4 mb-3 mt-4">
                            <label for="camp-label" class="form-label">Seleccione el campeonato</label>
                            <select class="form-select" id="campeonatos" onChange={handleCampChange} aria-label="campeonatos">
                                <option value="-1">Seleccione un campeonato</option>
                                {campeonatos.map(campeonato => {
                                    return (
                                        <option value={campeonato.idCampeonato}>{campeonato.descripcion}</option>
                                    );
                                })}
                            </select>
                        </div>
                        <div class="col-sm-4 mb-3">
                            <label for="camp-label" class="form-label">Seleccione el partido</label>
                            <select class="form-select" id="partidos" onChange={handlePartidoChange} aria-label= "partidos" >
                                <option value="-1">Seleccione el partido</option>
                                    {partidoConEquipos.map(part => { 
                                        return(
                                            <option value={part.partido.idPartido}>{part.clubL.nombre} VS {part.clubV.nombre}</option>
                                        )
                                    })}
                            </select>
                        </div>
                    </form>
                    <div className="table-responsive mt-4">
                        <div class="d-grid gap-2 mt-4 d-md-flex justify-content-md-end mb-4">
                            <button class="btn btn-success" type="button" data-bs-toggle="modal" data-bs-target="#agregarJugadorPartido">Agregar jugador</button>
                        </div>
                        {/*Modal agregar jugador*/}
                        <div class="modal fade" id="agregarJugadorPartido" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLabel">Agregar Jugador Partido</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <form onSubmit={handleJugadorSubmit}>
                                            <div class="col-6 mb-3">
                                                <label for="camp-label" class="form-label">Seleccione el jugador</label>
                                                <select class="form-select" id="jugadores" onChange={handleJugadorChange} aria-label= "partidos" >
                                                    <option value="-1">Seleccione el jugador</option>
                                                    {jugadoresDetalles.length !== 0 ? jugadoresDetalles.map(jugador => {
                                                        return(
                                                            <option value={jugador.jugador.idJugador}>{jugador.jugador.nombre} {jugador.jugador.apellido}</option>
                                                        )
                                                    }) : null}
                                                </select>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                <button type="submit" class="btn btn-success">Agregar</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Nombre </th>
                                    <th scope="col">Apellido</th>
                                    <th scope="col">Fecha nac</th>
                                    <th scope="col">Categoria</th>
                                    <th scope="col">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jugadores.length !== 0 ? jugadores.map(jugador => {
                                    console.log(jugador)
                                    return (
                                        <tr key={jugador.idJugador}>
                                            <th scope="row">{jugador.idJugador}</th>
                                            <td>{jugador.nombre}</td>
                                            <td>{jugador.apellido}</td>
                                            <td>{jugador.fechaNacimiento.substring(0,10)}</td>
                                            <td>{jugador.categoria}</td>
                                            <td><button class="btn btn-danger" onClick={() => handleEliminar(jugador.idJugador)} >Eliminar</button></td>
                                        </tr>
                                    )}) : null}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ListaJugadoresPartido;
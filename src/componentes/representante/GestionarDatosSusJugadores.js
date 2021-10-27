import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



function GestionarPersonalesJugador(){

    const params = useParams();
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [tipoDocumento, setTipoDocumento] = useState("");
    const [documento, setDocumento] = useState("");
    const [club, setClub]=useState("");
    const [fechaNac, setFechaNac] = useState(new Date());

    const [jugador, setJugador] = useState({});



    useEffect(() => {
        axios.get("http://localhost:8080/getClubPorIdRepresentante?idRepresentante="+params.idPersona)
        .then( response => {
            setClub(response.data);
            console.log(response.data);
        })
        .catch(error => {
            console.log(error);
        })
    },[])



    useEffect(() => {
        axios.get("http://localhost:8080/getJugadorPorId?idJugador="+params.idPersona)
        .then( response => {
            setJugador(response.data);
            console.log(response.data);
        })
        .catch(error => {
            console.log(error);
        })
    },[])

    useEffect(() => {
        setNombre(jugador.nombre);
        setApellido(jugador.apellido)
        setTipoDocumento(jugador.tipoDocumento);
        setDocumento(jugador.documento);
        setFechaNac(jugador.fechaNac)

    },[jugador])




    function handleNombreChange(e){
        setNombre(e.target.value);
    }

    function handleApellidoChange(e){
        setApellido(e.target.value);
    }

    function handleTipoDocumentoChange(e){
        setTipoDocumento(e.target.value);
    }

    function handleDocumentoChange(e){
        setDocumento(e.target.value);
    }





    function handleSubmit(e){
        e.preventDefault();
        axios.put("http://localhost:8080/modificarJugador?idJugador="+params.idPersona+"&tipoDocumento="+tipoDocumento+"&numeroDocumento="+documento+"&nombre="+nombre+"&apellido="+apellido+"&idClub="+club+"&fechaNac="+fechaNac)
        .then(response => {
            return toast.success("Datos del jugador modificados con exito");
        })
        .catch(error => {
            return toast.error("Error al modificar los datos del jugadores");
        })
    }



    return (
        <div className="container">
            <ToastContainer/>
            <div className="row">
                <h2>Gestionar sus datos</h2>
                <form className="mt-3" onSubmit={handleSubmit}>

                    <div class="mb-3">
                        <label for="nombre" class="form-label">Ingrese su nombre </label>
                        <input type="text" onChange={handleNombreChange}  class="form-control" id="nombre" aria-describedby="nombre" placeholder="Juan Pablo"/>
                    </div>

                    <div class="mb-3">
                        <label for="nombre" class="form-label">Ingrese su Apellido</label>
                        <input type="text" onChange={handleApellidoChange}  class="form-control" id="apellido" aria-describedby="apellido" placeholder="Perez"/>
                    </div>

                    <div class="mb-3">
                        <label class="control-label" for="fechaPartido">Fecha Inicio</label>
                        <DatePicker selected={fechaNac} onChange={(date) => setFechaNac(date)} className="form-control" id="fechaNac" name="fechaNac"/>
                    </div>

                    <div class="mb-3">
                        <p>Seleccione el tipo de documento</p> 
                            <select class="form-select" id="tipoDocumenento" onChange={handleTipoDocumentoChange} aria-label="tipoDocumento">
                                            <option selected >DNI</option>
                                            <option >Pasaporte</option>
                                            <option >Cedula de identidad</option>
                                            <option >Otro</option>
                            </select>
                    </div>

                    <div class="mb-3">
                        <label for="DNI" class="form-label">Ingrese su numero de Documento</label>
                        <input type="text" onChange={handleDocumentoChange}  class="form-control" id="documento" aria-describedby="documento" placeholder="25365874"/>
                    </div>

                    <button type="submit" class="btn btn-success">Actualizar</button>
                </form>
            </div>

        </div>
    )
 
}

export default GestionarPersonalesJugador;
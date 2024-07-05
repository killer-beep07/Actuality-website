import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ActualiteDetail = () => {
  const { id } = useParams();
  const [actualite, setActualite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8086/api/v1/actualites/${id}`)
      .then((response) => {
        const actualite = response.data;
        if (actualite.image) {
          // Convertir l'image base64 en un Blob
          const byteCharacters = atob(actualite.image);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "image/jpeg" });

          // Créer une URL pour le Blob
          const imageUrl = URL.createObjectURL(blob);
          setActualite({ ...actualite, imageUrl });
        } else {
          setActualite(actualite);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center mt-5">Chargement...</p>;
  if (error)
    return <p className="text-center mt-5">Erreur : {error.message}</p>;
  if (!actualite)
    return <p className="text-center mt-5">Aucune actualité trouvée</p>;

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="text-muted mb-3">
            <h4 className="text-uppercase mb-0">
              {actualite.type && actualite.type.nom}
            </h4>
          </div>
          <h1 className="card-title mb-3">{actualite.titre}</h1>
          {actualite.datePublication && (
            <p className="card-subtitle mb-3">
              Publié le : {actualite.datePublication}
            </p>
          )}
          <br />
          <br />
          {actualite.imageUrl && (
            <img
              src={actualite.imageUrl}
              alt={actualite.titre}
              className="img-fluid rounded mb-4"
            />
          )}

          <br />
          <br />
          
          <p
            className="card-text"
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: "1.2rem",
              lineHeight: "1.6",
            }}
          >
            {actualite.contenu}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActualiteDetail;

'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/context/UserContext'; // Importer useUser

interface FavoriteButtonProps {
  articleId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ articleId }) => {
  const { user } = useUser(); // Utiliser le contexte utilisateur
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = useCallback(() => !!user, [user]);

  const fetchFavoriteStatus = useCallback(async () => {
    // Condition modifiée: on vérifie juste si l'utilisateur est authentifié (user object existe)
    if (!articleId || !isAuthenticated()) {
      console.log(`[FavoriteButton ${articleId}] fetchFavoriteStatus: Aborted (articleId: ${articleId}, isAuthenticated: ${isAuthenticated()})`);
      return;
    }
    console.log(`[FavoriteButton ${articleId}] fetchFavoriteStatus: Fetching...`);
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/favorites/${articleId}/status`,
        {
          method: 'GET',
          // En-tête Authorization supprimé, le cookie httpOnly sera envoyé automatiquement
          headers: {
            // 'Authorization': `Bearer ${user.token}`, // Supprimé
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Important pour envoyer les cookies
        },
      );
      console.log(`[FavoriteButton ${articleId}] fetchFavoriteStatus: Response status: ${response.status}`);
      if (!response.ok) {
        console.error(
          `[FavoriteButton ${articleId}] fetchFavoriteStatus: Failed - Status: ${response.status} ${response.statusText}`,
        );
        return;
      }
      const data = await response.json();
      console.log(`[FavoriteButton ${articleId}] fetchFavoriteStatus: Data received:`, data);
      setIsFavorited(data.isFavorited);
      console.log(`[FavoriteButton ${articleId}] fetchFavoriteStatus: isFavorited set to ${data.isFavorited}`);
    } catch (error) {
      console.error(`[FavoriteButton ${articleId}] fetchFavoriteStatus: Error -`, error);
    } finally {
      setIsLoading(false);
      console.log(`[FavoriteButton ${articleId}] fetchFavoriteStatus: Done.`);
    }
  }, [articleId, isAuthenticated]); // user est toujours une dépendance pour savoir si l'on est authentifié // Ajouter user aux dépendances de useCallback

  useEffect(() => {
    if (user) { // Seulement fetch si l'utilisateur est chargé
        fetchFavoriteStatus();
    }
  }, [user, fetchFavoriteStatus]); // Ajouter user aux dépendances de useEffect

  const handleFavoriteClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Arrêter la propagation ici
    // Condition modifiée: on vérifie juste si l'utilisateur est authentifié (user object existe) et isLoading
    if (!articleId || !isAuthenticated() || isLoading) {
      console.log(`[FavoriteButton ${articleId}] handleFavoriteClick: Aborted (isLoading: ${isLoading}, articleId: ${articleId}, isAuthenticated: ${isAuthenticated()})`);
      return;
    }

    setIsLoading(true);
    const url = `${process.env.NEXT_PUBLIC_API_URL}/favorites/${articleId}`;
    const currentIsFavorited = isFavorited;
    const method = currentIsFavorited ? 'DELETE' : 'POST';
    console.log(`[FavoriteButton ${articleId}] handleFavoriteClick: Current isFavorited: ${currentIsFavorited}, Method: ${method}`);

    try {
      const response = await fetch(url, {
        method,
        // En-tête Authorization supprimé, le cookie httpOnly sera envoyé automatiquement
        headers: {
          // 'Authorization': `Bearer ${user.token}`, // Supprimé
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important pour envoyer les cookies
      });
      console.log(`[FavoriteButton ${articleId}] handleFavoriteClick: Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `[FavoriteButton ${articleId}] handleFavoriteClick: Failed - Method: ${method}, Status: ${response.status} ${response.statusText}, Body: ${errorText}`
        );
        await fetchFavoriteStatus(); 
        return;
      }

      console.log(`[FavoriteButton ${articleId}] handleFavoriteClick: Success - Method: ${method}. Current isFavorited before set: ${currentIsFavorited}. Setting to: ${!currentIsFavorited}`);
      setIsFavorited(!currentIsFavorited);

    } catch (error) {
      console.error(`[FavoriteButton ${articleId}] handleFavoriteClick: Error - Method: ${method}`, error);
      await fetchFavoriteStatus();
    } finally {
      setIsLoading(false);
      console.log(`[FavoriteButton ${articleId}] handleFavoriteClick: Done.`);
    }
  };

  if (!isAuthenticated()) {
    // Optionnel: afficher un bouton désactivé ou un message pour se connecter
    // ou ne rien afficher si l'utilisateur n'est pas connecté.
    return null; 
  }

  return (
    <button
      className="p-2"
      onClick={handleFavoriteClick}
      disabled={isLoading}
      aria-pressed={isFavorited}
      aria-label={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <Image
        src={isFavorited ? '/signet_open.svg' : '/signet.svg'}
        alt="Bookmark"
        className="font-bold"
        width={48}
        height={48}
        priority
      />
    </button>
  );
};

export default FavoriteButton;

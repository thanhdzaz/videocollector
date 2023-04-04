import { firestore } from '../firebase';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


export const Home = () => {


    useEffect(() => {
        firestore.get('data').then((data) => {
            setPhotos(data)
        });
    }, [])

    const navigate = useNavigate();



    const [photos, setPhotos] = useState<{ id: string, src: string, name: string }[]>([])
    return (
        <div className="App">
            <div className="brick-container"
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr',
                    gap: 20,
                    padding: 20,
                }}
            >
                {
                    photos?.map((photo) => (
                        <div>
                            <img style={{
                                objectFit: 'cover',
                                width: '30%',
                                cursor: 'pointer',
                                // height: 400,
                            }} src={photo.src} alt={photo.name}
                                onClick={() => {
                                    navigate(`/view/${photo.id}`)
                                }}
                            />
                        </div>
                    ))
                }
            </div>
        </div >
    )
}

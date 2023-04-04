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



    const [photos, setPhotos] = useState<{ id: string, src: string, type: string, name: string }[]>([])
    return (
        <div className="App">
            <div className="brick-container"
                style={{
                    display: 'grid',
                    gridTemplateColumns: '200px 200px 200px 200px',
                    gap: 20,
                    padding: 20,
                }}
            >
                {
                    photos?.map((photo) => {



                        return (
                            <div style={{
                                overflow: 'hidden'
                            }}>
                                {
                                    photo.type === 'videos' ? (<video onClick={() => {
                                        navigate(`/view/${photo.id}`)
                                    }} src={photo.src} controls={false} width={200} height={200} />) : (<img style={{
                                        objectFit: 'cover',
                                        width: 200,
                                        height: 200,
                                        cursor: 'pointer',
                                        // height: 400,
                                    }} src={photo.src} alt={photo.id}
                                        onClick={() => {
                                            navigate(`/view/${photo.id}`)
                                        }}
                                    />)
                                }

                                <div>{photo.name}</div>
                            </div>
                        )
                    })
                }
            </div>
        </div >
    )
}


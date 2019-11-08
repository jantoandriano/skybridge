import React from 'react';

const Users = ({firstName, lastName, age, city, state, postalCode, image}) => {
    let colorValue = {
        backgroundColor: "white"
    }
    if (age <= 17) {
        colorValue = {
            backgroundColor: "red"
        }
    } else if (age <= 30) {
        colorValue = {
            backgroundColor: "green"
        }
    } else if (age > 30){
        colorValue = {
            backgroundColor : "blue"
        }
    }

    return (
        <div className="card" style={{width: "18rem"}}>
            <img src={image} className="card-img-top" alt={firstName} />
                <div className="card-body" style={colorValue}>
                    <h5 className="card-title">{firstName}{lastName}</h5>
                    <p className="card-text">age: {age}, city:{city}, state: {state}, post code: {postalCode}</p>
                </div>
        </div>
    )
}

export default Users

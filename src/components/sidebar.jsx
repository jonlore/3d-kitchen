import { useState } from "react"

export default function Sidebar() {
    const [colors, setColors] = useState(["Green", "Beige", "Yellow", "White", "Black"]);
    const [materials, setMaterials] = useState(["material1", "material2", "material3"]);

    return (
        <>
            <div id='sidebar'> 
                <header>
                    <h1>Start design your dream kitchen!</h1>
                </header>
                <div id='color-options'>
                    <p>Color</p>
                    <div id="colors">
                        {colors.map(color => 
                            <div key={color}>
                                <div className={`circle-option ${color.toLowerCase()}`} id={`color-${color.toLowerCase()}`}></div>
                                <span>{color}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div id='material-options'>
                    <p>Material</p>
                    <div id="materials">
                        {materials.map(material => 
                            <div key={material}>
                                <div className={`material-option ${material.toLowerCase()}`} id={`material-${material.toLowerCase()}`}></div>
                                <span>{material}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
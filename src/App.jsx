import { useEffect} from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { degToRad} from 'three/src/math/MathUtils';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';





function App() {
    
  useEffect(() => {
    
  
    //new scene
    const scene = new THREE.Scene();
    //new camera parameters: FOV, aspect ratio, near + far point
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
    );
    const light = new THREE.AmbientLight( 0x000000 ); // soft white light
    scene.add( light );

    const canvas = document.getElementById('OrbitSimulationCanvas');
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    let paused = false;

    const x1Button = document.getElementById("x1");
    x1Button.addEventListener("click", x1, false);
    function x1() {
        simSpeed = 1;
        document.getElementById("simSpeed").src="/src/assets/Lowest_Speed.png";
        x1Button.style.pointerEvents = 'none';
        x10000Button.style.pointerEvents = 'auto';
        x10Button.style.pointerEvents = 'auto';
        x100Button.style.pointerEvents = 'auto';
        x1000Button.style.pointerEvents = 'auto';

    }
    const x10Button = document.getElementById("x10");
    x10Button.addEventListener("click", x10, false);
    function x10() { 
        simSpeed = 10;
        document.getElementById("simSpeed").src="/src/assets/x10_Speed.png";
        x10Button.style.pointerEvents = 'none'; 
        x1Button.style.pointerEvents = 'auto';
        x10000Button.style.pointerEvents = 'auto';
        x100Button.style.pointerEvents = 'auto';
        x1000Button.style.pointerEvents = 'auto';
    }
    const x100Button = document.getElementById("x100");
    x100Button.addEventListener("click", x100, false);
    function x100() { 
        simSpeed = 100; 
        document.getElementById("simSpeed").src="/src/assets/x100_Speed.png";
        x100Button.style.pointerEvents = 'none';
        x1Button.style.pointerEvents = 'auto';
        x10Button.style.pointerEvents = 'auto';
        x10000Button.style.pointerEvents = 'auto';
        x1000Button.style.pointerEvents = 'auto';
    }
    const x1000Button = document.getElementById("x1000");
    x1000Button.addEventListener("click", x1000, false);
    function x1000() { 
        simSpeed = 1000;
        document.getElementById("simSpeed").src="/src/assets/x1000_Speed.png";
        x1000Button.style.pointerEvents = 'none';
        x1Button.style.pointerEvents = 'auto';
        x10Button.style.pointerEvents = 'auto';
        x100Button.style.pointerEvents = 'auto';
        x10000Button.style.pointerEvents = 'auto';
    }
    const x10000Button = document.getElementById("x10000");
    x10000Button.addEventListener("click", x10000, false);
    function x10000() { 
        simSpeed = 10000; 
        document.getElementById("simSpeed").src="/src/assets/x10000_Speed.png";
        x10000Button.style.pointerEvents = 'none';
        x1Button.style.pointerEvents = 'auto';
        x10Button.style.pointerEvents = 'auto';
        x100Button.style.pointerEvents = 'auto';
        x1000Button.style.pointerEvents = 'auto';
    }

    const resetButton = document.getElementById("reset");
    resetButton.addEventListener("click", reset, false);
    function reset(){
        window.location.reload();
    }

    const pauseButton = document.getElementById("PAW");
    pauseButton.addEventListener("click",pause,false);
    function pause(){
        if(paused){
            document.getElementById("pause").src = 'src/assets/Paused.png'; 
        }
        else{
            document.getElementById("pause").src = 'src/assets/Sim_On.png';
        }
        paused = !paused;
    }

    const upButton = document.getElementById("up");
    upButton.addEventListener("mouseover",up,false);
    function up(){
        document.getElementById("thrust").src = "src/assets/up.png";
    }
    upButton.addEventListener("click",up_click,false);
    function up_click(){
        if (!crashed && speed<10){
            document.getElementById("orbit").src = "/src/assets/Orbit_Locked.png";
            velocity.normalize().multiplyScalar(speed +.0001);
            K = 0.5 * m * speed * speed;
            U = -1 * m * M *G /( satellite.position.length());
            energy = K + U;
            var a = -1 * m * M * G / (2 * energy);
            //T = Math.sqrt(4 * Math.PI * Math.PI * a *a * a /(M * G));
            markMat = new THREE.LineBasicMaterial({color: generateLightColorHex()});
            //t = 0;
            var x = new THREE.Vector3();
            var e = (x.crossVectors(velocity,x.crossVectors(satellite.position,velocity)).divideScalar(M*G).sub(satellite.position.clone().normalize())).length();
            var periapsis = a*(1-e);
            
            if((periapsis) <= (6.3781 + 0.9) && periapsis>0) {
                document.getElementById("orbit").src = "/src/assets/Orbit_Crash.png";
            }
    
            if(a<=0){
                document.getElementById("orbit").src = "/src/assets/Orbit_Unbound.png";  
            }
        
        }
    }

    const downButton = document.getElementById("down");
    downButton.addEventListener("mouseover",down,false);
    function down(){
        document.getElementById("thrust").src = "src/assets/backward.png"
    }
    downButton.addEventListener("click",down_click,false);
    function down_click(){
        if (!crashed && speed>.0001){
            document.getElementById("orbit").src = "/src/assets/Orbit_Locked.png";
            velocity.normalize().multiplyScalar(speed -.0001);
            K = 0.5 * m * speed * speed;
            U = -1 * m * M *G /( satellite.position.length());
            energy = K + U;
            a = -1 * m * M * G / (2 * energy);
            //T = Math.sqrt(4 * Math.PI * Math.PI * a *a * a /(M * G));
            markMat = new THREE.LineBasicMaterial({color: generateLightColorHex()});
            //t = 0;
            var x = new THREE.Vector3();
            var e = (x.crossVectors(velocity,x.crossVectors(satellite.position,velocity)).divideScalar(M*G).sub(satellite.position.clone().normalize())).length();
            var periapsis = a*(1-e);
            
            if((periapsis) <= (6.3781 + 0.9) && periapsis>0) {
                document.getElementById("orbit").src = "/src/assets/Orbit_Crash.png";
            }
    
            if(a<=0){
                document.getElementById("orbit").src = "/src/assets/Orbit_Unbound.png";  
            }
        }
        
    }


    const orbit = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0,60,0);//set position x,y,z
    orbit.update();
    renderer.shadowMap.enabled=true;

    //create earth
    const textureLoader = new THREE.TextureLoader();
    const sphereGeometry = new THREE.SphereGeometry(6.3781, 100,100);
    const sphereMaterial = new THREE.MeshBasicMaterial();
    sphereMaterial.map = textureLoader.load('src/assets/earth.jpg');
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    sphere.rotation.z = degToRad(-23.5)

    let satellite;

    const satelliteGeometry = new THREE.SphereGeometry(0.9);
    const satelliteMaterial = new THREE.MeshBasicMaterial();
    satelliteMaterial.map = textureLoader.load('src/assets/moon.jpg');
    satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
    satellite.position.set(6.3781 + 35.785,0,0);
    scene.add(satellite);
    //satellite.rotation.y =Math.PI/4 + 1;

    const directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
    scene.add( directionalLight );
    
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('src/rocket_2/scene.gltf', function(gltf) {
        gltf.scene.traverse( function (child) {

            if ( child.material ) child.material.metalness = 0;
            if(child.isMesh){
                child.geometry.center();
            }
        
        } );
        const model = gltf.scene;
        model.scale.set(0.25,0.25,0.25) 
        scene.remove(satellite);
        scene.add(model);
        satellite = model;
        satellite.position.set(6.3781 + 35.785,0,0);
        satellite.rotation.x = -(Math.PI /2);
        
    });

    
    let details = true;
    
    
    
    

    //constants and variables
    const m = 2.5e+18;
    const M = 5.972 * Math.pow(10, 24);
    const G = 6.6743 * Math.pow(10,-29);
    var r = new THREE.Vector3();
    r = satellite.position.clone();
    var dr = new THREE.Vector3();
    var speed = 0.00307465572;
    var velocity = new THREE.Vector3(0,0,-1);
    velocity.multiplyScalar(speed);

    var force = new THREE.Vector3();
    force = r.clone().normalize().multiplyScalar(-1*m*M*G/(r.length() * r.length()));



    var energy = -1 * m * M *G /(2 * r.length());
    var a = r.length();
    var K = 0.5 * m * speed *speed;
    var U = -1* m * M * G / a;

    /** 
    var energy = -1 * m * M *G /(2 * r.length());
    var a = r.length();
    var K = 0.5 * m * speed *speed;
    var U = -1* m * M * G / a;
    var T = Math.sqrt(4 * Math.PI * Math.PI * a *a * a /(M * G));
    var t = 0; 
    var e = 0;
    var periapsis = a*(1-e);
    var apoapsis = a*(1+e);
    */ 

    scene.background = textureLoader.load('src/assets/stars.jpg')
    //renderer.setClearColor("black");
    var simSpeed = 1000;


    /** 
    //details
    var text2 = document.createElement('div');
    text2.style.position = 'absolute';
    text2.innerHTML = '';
    text2.style.top = 0 + 'px';
    text2.style.left = 0 + 'px';
    document.body.appendChild(text2);
    text2.style.display = 'none';
    text2.style.fontSize = '24px';
    text2.style.backgroundColor = 'black';
    text2.style.color = 'yellow';

    //crash
    var text = document.createElement('div');
    text.style.position = 'absolute';
    text.style.fontSize = '128px';
    text.style.backgroundColor = 'white';
    text.innerHTML = "CRASH!!!!";
    text.style.top = "10%";
    text.style.left = "30%"
    document.body.appendChild(text);
    text.style.display = 'none';
    text.style.color = 'red';
    text.style.borderBlockStyle = 'dashed'
    text.style.borderBlockColor = 'red';
    
    //paused
    var text3 = document.createElement('div');
    text3.style.position = 'absolute';
    text3.style.fontSize = '64px'
    text3.style.color = '#FFA701';
    text3.innerHTML = "<strong>*Paused*</strong>";
    text3.style.top = '0px';
    text3.style.left = '40%'
    text3.style.textAlign = 'top';
    document.body.appendChild(text3);
    text3.style.display = 'none';
    text3.style.backgroundColor = 'black';
    //orbit status
    var text4 = document.createElement('div');
    text4.style.position = 'absolute';
    text4.style.fontSize = '32px'
    text4.style.color = 'green';
    text4.innerHTML = "Bound Orbit";
    text4.style.bottom = '0px';
    text4.style.left = '43%'
    document.body.appendChild(text4);
    text4.style.display = 'inline';
    text4.style.backgroundColor = 'black';
    //joulemeter legend
    var text5 = document.createElement('div');
    text5.style.position = 'absolute';
    text5.style.fontSize = '16px';
    text5.style.backgroundColor = 'white';
    text5.innerHTML = "🟪 Total Mechanical Energy<br>🟦 Kinetic Energy<br>🟩 Potential Energy";
    text5.style.bottom = '42%';
    text5.style.right = '0px' ;
    text5.style.color = 'white';
    text5.style.backgroundColor = 'black';
    document.body.appendChild(text5);
    text5.style.display = 'none';
    //credits
    var text6 = document.createElement('div');
    text6.style.position = 'absolute';
    //text6.style.fontSize = '32px'
    text6.style.color = 'gray';
    text6.innerHTML = "Mikolaj Konieczny 2022";
    text6.style.bottom = '0px';
    text6.style.left = '0px'
    document.body.appendChild(text6);
    text6.style.display = 'inline';
    text6.style.backgroundColor = 'black';
    */

     
    //create energy dial
    var d = window.innerWidth*0.0011
    const boyGeometry = new THREE.CircleGeometry(d,100,100);
    const circleMat = new THREE.MeshBasicMaterial({color:'white', map: textureLoader.load('src/assets/dialText.jpg')});
    const dial = new THREE.Mesh(boyGeometry, circleMat);

    const energyArrow = new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0),d,'purple');
    const KArrow = new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0),d,'blue');
    const UArrow = new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0),d,'green');
    dial.add(UArrow);
    dial.add(KArrow);
    dial.add(energyArrow);

    const c = (Math.PI*2/3)/(m*M*G/(6.3781 + 0.9));
    UArrow.rotateZ(-c*U);
    KArrow.rotateZ(-c*K);
    energyArrow.rotateZ(-c*energy);

    
    //var L = crossL();
    

    



    /** 
    //gui options
    const gui = new dat.GUI({width: 250});
    const options = {
        simSpeed: 1000,
        speed: (speed * 1000000).toExponential(2),
        reset: function(e){
            document.location.reload(); 
        },
        details: false,
        pause: function(e){
            if(!paused){
                oldSpeed = simSpeed;
                simSpeed = 0;
                paused = true;
                text3.style.display = 'inline';
            }
            else{
                if(simSpeed==0){
                    simSpeed = oldSpeed;
                    oldSpeed = 0;
                }
                text3.style.display = 'none';
                paused = false;
            }
        },
        forwardThrust: function(e){
            changeSpeed(speed*1000000 + 100);
        },
        backThrust: function(e){
            changeSpeed(speed*1000000 - 100);
        },
        show_Graph: false
    }
    
    var paused = false;


    gui.add(options, 'simSpeed',1,10000, 1).onChange(function(e){
        if(!paused){
            simSpeed = e;
        }
        else{
            oldSpeed = e;
        }
        
    }).name("Simulation Speed");
    var f1 = gui.addFolder('Change speed');

    var speedGUI = f1.add(options, 'speed', 0, 10000).onFinishChange(function(e){
        changeSpeed(e);
    });
    f1.open();

    function changeSpeed(event){
        if (event >= 0 && event <= 12000 && !crashed){
        text4.innerHTML = "Bound Orbit";
        text4.style.color = 'green';
        speed = event/1000000;
        velocity.normalize().multiplyScalar(speed);
        K = 0.5 * m * speed * speed;
        U = -1 * m * M *G /( satellite.position.length());
        energy = K + U;
        a = -1 * m * M * G / (2 * energy);
        T = Math.sqrt(4 * Math.PI * Math.PI * a *a * a /(M * G));
        markMat = new THREE.LineBasicMaterial({color: generateLightColorHex()});
        t = 0;
        L = crossL();
        
        var x = new THREE.Vector3();
        e = (x.crossVectors(velocity,x.crossVectors(satellite.position,velocity)).divideScalar(M*G).sub(satellite.position.clone().normalize())).length();
        periapsis = a*(1-e);
        apoapsis = a*(1+e);
        
        if((periapsis) <= (6.3781 + 0.9)) {
            T = NaN;
            a=NaN
            text4.innerHTML = "Crash Imminent!";
            text4.style.color = 'red';
        }

        if(a<=0){
            text4.innerHTML = "Unbound Orbit";
            text4.style.color = 'blue';
            a =NaN;
            apoapsis = NaN;
            periapsis = NaN;
        }
        
        
        

    }  
                                                                                                                        

    }

    f1.add(options, 'forwardThrust').name("⬆️ Forward Thrust");
    f1.add(options, 'backThrust').name("⬇️ Backward Thrust");

    gui.add(options, 'reset');
    var details = false;
    gui.add(options, 'details').onChange(function(e){
        if(!e){
            text2.style.display = 'none';
            details = false;
            scene.remove(keplerArea);
            scene.remove(line);
            keplerArea.geometry.attributes.position.array = new Float32Array(180);
            i =0;
            keplerArea.geometry.attributes.position.needsUpdate = true;
            scene.remove(dial);
            text5.style.display = 'none';
            
            
        
        }
        else{
            text2.style.display = 'inline';
            details = true;
            scene.add(keplerArea);
            geometry = new THREE.BufferGeometry().setFromPoints( orbital );
            line = new THREE.Line( geometry, markMat );
            scene.add(line);
            scene.add(dial);
            text5.style.display = 'inline';
            
            
            
        }
    });



    gui.add(options, 'pause');
    */
    var oldSpeed;



    //generate random colour for orbit
    function generateLightColorHex() {
        let color = "#";
        for (let i = 0; i < 3; i++)
          color += ("0" + Math.floor(((1 + Math.random()) * Math.pow(16, 2)) / 2).toString(16)).slice(-2);
        return color;
      }

    var current = new THREE.Vector3();
    let then = 0;
    const animate = (now) => {
      now *=  0.001;
    const deltaTime = (now - then)*simSpeed;
    then = now;
    if ((deltaTime)<170 && !paused && !crashed){
            
            
        //t += deltaTime;
        sphere.rotateY(0.000072921159 * deltaTime);
        dr = velocity.clone().multiplyScalar(deltaTime);
        current = satellite.position.clone();
        satellite.position.add(dr);
        satellite.rotation.z += Math.acos((r.dot(satellite.position))/(r.length()*satellite.position.length()));
    
        r = satellite.position.clone();
        force = r.clone().normalize().multiplyScalar(-1*m*M*G/(r.length() * r.length()));
        velocity.add(force.clone().multiplyScalar(deltaTime/m));
        speed = velocity.length();
        K = 0.5 * m * speed *speed;
        U = -1 * m * M *G /( satellite.position.length())
        orbital.push(satellite.position.clone());
        if (orbital[1999] != null){
            orbital.splice(0, 1);
            
        }

        if (details){
            scene.remove(line);
            geometry = new THREE.BufferGeometry().setFromPoints( orbital );
            line = new THREE.Line( geometry, markMat );
            scene.add(line);
            
            
            kepler();

            

            
            

        }
    
        
        if(satellite.position.length() < (6.3781 + 0.9)){
            simSpeed = 0;
            paused =true;
            crashed = true;
        }
  
    }

    
    /** 
    //updateText();
    */

    dial.position.copy( camera.position );
    dial.rotation.copy( camera.rotation );
    dial.updateMatrix();
    dial.translateZ(-10);
    dial.translateY(window.innerHeight*-0.008);
    dial.translateX(window.innerWidth*-0.0067);
    UArrow.setDirection(new THREE.Vector3(0,1,0));
    KArrow.setDirection(new THREE.Vector3(0,1,0));
    energyArrow.setDirection(new THREE.Vector3(0,1,0));
    UArrow.rotateZ(-c*U);
    KArrow.rotateZ(-c*K);
    energyArrow.rotateZ(-c*energy); 
    
    
    
    renderer.render(scene, camera);
    };


    animate();
    var crashed = false;   
    //create kepler second law animation 
    const keplerMat = new THREE.MeshBasicMaterial({color: 'yellow', side: THREE.DoubleSide});
    const points = new Float32Array(180);
    var keplerGeometry = new THREE.BufferGeometry();
    keplerGeometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
    var keplerArea = new THREE.Mesh( keplerGeometry, keplerMat );

    const orbital = [];
    var geometry = new THREE.BufferGeometry().setFromPoints( orbital );
    var line = new THREE.Line( geometry, markMat );

    //text2.style.display = 'inline';
    scene.add(keplerArea);
    scene.add(line);
    scene.add(dial);
    //text5.style.display = 'inline';





    var i = 0;

    function kepler(){

    const points = keplerArea.geometry.attributes.position.array;
    points[i] = 0;
    i++;
    points[i] = 0;
    i++;
    points[i] = 0;
    i++;
    points[i] = current.x;
    i++;
    points[i] = current.y;
    i++;
    points[i] = current.z;
    i++;
    points[i] = r.x;
    i++;
    points[i] = r.y;
    i++;
    points[i] = r.z;
    i++;

    if(i == 180){
        for(let z = 9; z < 180; z++){
            points[z-9] = points[z];
        }
        i = 171;

    }

    keplerArea.geometry.attributes.position.needsUpdate = true;
    }

    //resizing function
    window.addEventListener('resize', function(){
        camera.aspect = window.innerWidth/this.window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    /** 
    function updateText(){
        text2.innerHTML = 'T = ' + T.toExponential(2) + ' s<br>a = ' + (a*Math.pow(10,6)).toExponential(2)
        + ' m<br><br><br>L = ' + L 
        + ' kg m<sup>2</sup> s<sup>-2</sup><br>dA/dt = ' + (L/(2*m)).toExponential(2) + ' m<sup>2</sup> s<sup>-1</sup><br><br><br>r = ' + (satellite.position.length()*Math.pow(10,6)).toExponential(2) + ' m<br>v = '
        + (speed*Math.pow(10,6)).toExponential(2) + ' m s<sup>-1</sup><br>v<sub>esc</sub> = ' + (Math.SQRT2*Math.pow(10,6)*Math.sqrt(M*G/satellite.position.length())).toExponential(2)
        + ' m s<sup>-1</sup><br><br><br>ε = ' + e.toPrecision(4)
        + '<br>periapsis = ' + (periapsis*Math.pow(10,6)).toExponential(2) + ' m<br>apoapsis = ' + (apoapsis*Math.pow(10,6)).toExponential(2) + ' m';
    }
   
    function crossL(){
        var L2 = (satellite.position.clone().cross(velocity).length() * Math.pow(10,12) * m);
        if(L2 < Math.pow(10, 15)){
            return 0;
        }
        
        return L2.toExponential(2);
    }
    */
    var markMat = new THREE.LineBasicMaterial({
      color: 0x0000ff
    });

    renderer.setAnimationLoop(animate);


    

      
    
  },[]);
    
  return (
    <div>
      <canvas id="OrbitSimulationCanvas" />
    </div>

  );
  


 

 


}

export default App

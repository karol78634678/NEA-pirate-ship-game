let menuBackgroundImage;
let level1;
let key;
let gameState = "Menu";
let coins;
let enemyHealth;
let playerHealth;
let cannonTimer = 1;
let windDirection;
let cannons;
let glueJoints = []; 
let gatesUnlocked =[false,false,false,false,false] //array to keep track of which gates are unlocked
let enemyInventory = [
    [ //level 1 enemy inventory
        [false,1], //enemy 0 does not have a key
        [false,2], //enemy 1 does not have a key
        [false,1], //enemy 2 does not have a key
        [true,1], //enemy 3 has a key for gate 1
        [true,0], //enemy 4 has a key for gate 0
        [true,2], //enemy 5 has a key for gate 2
        [false,0], //enemy 6 does not have a key
        [true,4], //enemy 7 has a key for gate 4
        [true,3] ,//enemy 8 has a key for gate 3
    ],

    [
        //level 2 enemy inventory
    ]
]
let keyCounter = 0 //ID for each key created
let tutorialScreenCounter = 0 //counter to keep track of how many times the tutorial screen has been shown

function preload(){ 
    //load images here
    menuBackgroundImage = loadImage('images/menuBgImg.png')
    gameLogoImg = loadImage('images/gameLogo.png')
    playButtonImg = loadImage('images/playButton.png')
    quitButtonImg = loadImage('images/quitButton.png')
    tutorialButtonImg = loadImage('images/tutorialButton.png')
    tutorialMenuBackground = loadImage('images/tutorialMenuBackground.png')
    tutorialMenuExitButtonImg = loadImage('images/tutorialMenuExitButton.png')
    waterImg = loadImage('images/backgroundImg.png')
    menuBackgroundImage = loadImage('images/menuBgImg.png')
    playerShip = loadImage('images/playerImg.png')
    treasureImg = loadImage('images/treasure.png')
    cannonBallImg = loadImage('images/cannonBall.png')
    enemyCannonBallImg = loadImage('images/enemyCannonBall.png')
    gateImg = loadImage('images/gate.png')
    gateVerticalImg = loadImage('images/gateVertical.png')
    horizontalWallImg = loadImage('images/horizontalWall.png')
    verticalWallImg = loadImage('images/verticalWall.png')
    towerImg = loadImage('images/tower.png')
    enemyImg = loadImage('images/enemy.png')
    pauseBgImg = loadImage('images/pauseBg.png')
    resumeButtonImg = loadImage('images/resumeButton.png')
    exitButton = loadImage('images/exitToMenu.png')
    keyImg = loadImage('images/key.png')
    initalTutorialImg = loadImage('images/initalTutorial.png')
    damage1 = loadImage('images/playerDamage1.png')
    damage2 = loadImage('images/playerDamage2.png')
    damage3 = loadImage('images/playerDamage3.png')
    damage4 = loadImage('images/playerDamage4.png')
    gameOverBgImg = loadImage('images/gameOverBG.png')
    retryImg = loadImage('images/retry.png')
    returnToMenuImg = loadImage('images/returnToMenu.png')
    levelCompleteImg = loadImage('images/levelComplete.png')

    //load sounds here
    alertSound = loadSound('sounds/alert.mp3')
    shot = loadSound('sounds/shot.mp3')
    explosionSound = loadSound('sounds/explosion.mp3')
    levelFailed = loadSound('sounds/levelFailed.mp3')
    backgroundMusic = loadSound('sounds/backgroundMusic.wav')
}

function setup(){
    new Canvas(windowWidth,windowHeight)
    displayMode('centered');
    allSprites.autoDraw = false;
    world.autoStep = false;
    allSprites.debug = false;

    menu = new Group()
    
    //create a logo for the game    
    logo = new menu.Sprite()
    logo.image = gameLogoImg
    logo.collider = 'n'
    logo.y = 100

    //create the play button for the game
    playButton = new menu.Sprite()
    playButton.image = playButtonImg
    playButton.image.scale = 1.5
    playButton.collider = 'n'
    playButton.y = 350
    playButton.w = 650
    playButton.h = 280

    //create the quit button for the game
    quitButton = new menu.Sprite()
    quitButton.image = quitButtonImg
    quitButton.image.scale = 1.05
    quitButton.collider = 'n'
    quitButton.y = 850
    quitButton.w = 450
    quitButton.h = 200

    //create the tutorial button for the game
    tutorialButton = new menu.Sprite()
    tutorialButton.image = tutorialButtonImg
    tutorialButton.y = 600
    tutorialButton.image.scale = 0.65
    tutorialButton.collider = 'n'
    tutorialButton.w = 280
    tutorialButton.h = 120

    //create a sprite for the player
	player = new Sprite()
	player.tile = 'm'
	player.image = playerShip
	player.h = 25
	player.w = 55
	player.collider = 'd'
	player.scale = 1.5
    player.isTarget = true
    player.playerHealth = 100;


	//cannon ball for the player combat function
	cannonBall = new Group()
	cannonBall.image = cannonBallImg
    cannonBall.r = 3.5
	cannonBall.collider = 'n'
	cannonBall.overlaps(cannonBall)
	player.overlaps(cannonBall)

    //create the tutorial Menu
    tutorial = new Sprite()
	tutorial.image = tutorialMenuBackground
	tutorial.h = 500
	tutorial.w = 500
	tutorial.collider = 'n'
    tutorial.image.scale = 2

    tutorialExit = new Sprite()
    tutorialExit.image = tutorialMenuExitButtonImg
	tutorialExit.h = 50
	tutorialExit.w = 50
    tutorialExit.x = 1200
	tutorialExit.y = 170
	tutorialExit.collider = 'n'
    tutorialExit.image.scale = 0.6
	
    gameTiles = new Group()
    gameTiles.isWall = true
    horizontalWall = new gameTiles.Group()
    horizontalWall.tile = 'B'
    horizontalWall.collider = 's'
    horizontalWall.image = horizontalWallImg
    horizontalWall.w =32
    horizontalWall.h = 27

    verticalWall = new gameTiles.Group()
    verticalWall.tile = 'C'
    verticalWall.collider = 's'
    verticalWall.image = verticalWallImg
    verticalWall.w =27
    verticalWall.h = 32

    tower = new gameTiles.Group()
    tower.tile = 'J'
    tower.collider = 's'
    tower.image = towerImg
    tower.r = 28
    tower.image.scale = 2

    gate = new Group()
    gate.id;
    gateHorizontal = new gate.Group()
    gateHorizontal.tile = 't'
    gateHorizontal.collider = 's'
    gateHorizontal.image = gateImg
    gateHorizontal.w = 252
    gateHorizontal.h = 35
    gateHorizontal.image.scale = 0.4
    gateHorizontal.image.scale.x = 0.77

    gateVertical = new gate.Group()
    gateVertical.tile = 'u'
    gateVertical.collider = 's'
    gateVertical.image = gateVerticalImg
    gateVertical.w = 35
    gateVertical.h = 252
    gateVertical.y = -100
    gateVertical.image.scale = 0.4
    gateVertical.image.scale.y = 0.77
    tower.overlaps(gate)
    
    //create a tile for the treasure scattered around the map
	treasure = new gameTiles.Group()
	treasure.tile = 'x'
	treasure.image = treasureImg
	treasure.h = 50
	treasure.w = 50
	treasure.collider = 's'
	treasure.image.scale = 0.2
    player.overlaps(treasure)
    coins = 0

    //the group for the gate keys
    key = new Group()
    key.image = keyImg
    key.w = 30
    key.h = 30
    key.collider = 'n'
    key.gateID = 0
    key.image.scale = 0.1

    //create a sprite for the enemy
    enemy = new Group()
    enemy.hasKey = false;
    enemy.tile = 'e'
    enemy.image = enemyImg
    enemy.h = 35
	enemy.w = 80
    enemy.enemyHealth = 90
    enemy.id;
    enemy.image.scale = 1.5
    enemy.collider = 'd'
    enemy.gate = 0

    //pause menu background
    pauseMenu = new Sprite()
    pauseMenu.image = pauseBgImg
    pauseMenu.x = windowWidth/2
    pauseMenu.y = windowHeight/2
    pauseMenu.collider = 'n'
    pauseMenu.w = 1000
    pauseMenu.h = 500

    //pause menu resume button
    resumeButton = new Sprite()
    resumeButton.image = resumeButtonImg
    resumeButton.x = windowWidth/2
    resumeButton.y = windowHeight/2 - 60
    resumeButton.w = 350
    resumeButton.h = 110
    resumeButton.collider = 'n'
    resumeButton.image.scale = 0.3

    //pause menu back to main menu button
    exitToMenuButton = new Sprite()
    exitToMenuButton.image = exitButton
    exitToMenuButton.x = windowWidth/2
    exitToMenuButton.y = windowHeight/2 + 100
    exitToMenuButton.w = 350
    exitToMenuButton.h = 110
    exitToMenuButton.collider = 'n'
    exitToMenuButton.image.scale = 0.3

    //enemy cannon balls
    enemyCannonBall = new Group()
	enemyCannonBall.image = enemyCannonBallImg
    enemyCannonBall.r = 3.5
	enemyCannonBall.collider = 'n'
	enemy.overlaps(enemyCannonBall)

    //level complete screen
    levelComplete = new Group()

    //level complete background
    levelCompleteBackground = new levelComplete.Sprite()
    levelCompleteBackground.image = levelCompleteImg
    levelCompleteBackground.collider = 'n'
    levelCompleteBackground.x = windowWidth/2
    levelCompleteBackground.y = windowHeight/2
    levelCompleteBackground.w = 800
    levelCompleteBackground.h = 600

    //level complete back to menu button
    levelCompleteBackToMenu = new levelComplete.Sprite()
    levelCompleteBackToMenu.image = returnToMenuImg
    levelCompleteBackToMenu.collider = 's'
    levelCompleteBackToMenu.x = windowWidth/2
    levelCompleteBackToMenu.y = windowHeight/2 + 100
    levelCompleteBackToMenu.w = 350
    levelCompleteBackToMenu.h = 110
    levelCompleteBackToMenu.image.scale = 0.3

    //a group for my explosion animations
    explosionGraphics = new Group()
    explosionGraphics.life = 120

    cannonHit = new explosionGraphics.Group(); // animation for the cannon ball colliding with something
	cannonHit.spriteSheet = 'images/cannonHit.png';
    cannonHit.w = 110
    cannonHit.h = 121
    cannonHit.collider = 'n'
    cannonHit.anis.frameDelay = 4
	cannonHit.addAnis({
		explosion1: { row: 0, frames: 5 },
        stop: { row: 0, frames: 1 }
	});
    cannonHit.ani = 'explode1'

    cannonHitEnemy = new explosionGraphics.Group(); // animation for the enemy cannon ball colliding with something
	cannonHitEnemy.spriteSheet = 'images/cannonHit.png';
    cannonHitEnemy.w = 110
    cannonHitEnemy.h = 121
    cannonHitEnemy.collider = 'n'
    cannonHitEnemy.anis.frameDelay = 4
	cannonHitEnemy.addAnis({
		explosion1: { row: 0, frames: 5 },
        stop: { row: 0, frames: 1 }
	});

    player.overlaps(enemyCannonBall, function(p,ec){
        c = new cannonHitEnemy.Sprite(ec.x,ec.y)
        c.changeAni(["explosion1","stop",";;"])
        ec.remove()
        explosionSound.play()
        p.playerHealth -= 5
        if(p.playerHealth == 0){
            levelFailed.play()
            gameState = "gameOver"
        }
    })

    enemy.overlaps(cannonBall, function(e,ec){
        c = new cannonHit.Sprite(ec.x,ec.y)
        c.changeAni(["explosion1","stop",";;"])
        ec.remove()
        e.enemyHealth -= 30
        console.log(e)
        explosionSound.play()

        if(e.enemyHealth <= 0){ //if the enemy health is 0 the enemy gets removed
            if(e.hasKey){
                //drop key here
                let x = new key.Sprite(e.x,e.y) //create a key at the enemy's position
                x.gateID = e.gate //assign the gateID to the id of the key dropped
                x.id = keyCounter++ //id for this key sprite
                console.log("key dropped for gate", x.gateID)
            }
            e.remove()
        }
    })

    setInterval(enemyAttack,2000)

    //timer for the cannon shots
    setInterval(function(){
        cannonTimer +=1 //every 2 seconds 1 is added to the cannonTimer
    },2000)

    player.overlaps(key, function(p,k){ //when the player overlaps a key
        gatesUnlocked[k.gateID] = true //set the gate that the key opens to unlocked
        console.log("key collected for gate", k.gateID) //log that the key has been collected
        k.remove() //remove the key from the map
        alertSound.play()
    })

    player.overlaps(gate, function(p,g){ //when the player overlaps a gate
        if(gatesUnlocked[g.id] == true){ //check if the gate is unlocked
            g.remove() //remove the gate from the map
            console.log("gate opened") //log that the gate has been opened
        }
    })

    //create the inital tutorial screen
    initalTutorialSprite = new Sprite()
    initalTutorialSprite.image = initalTutorialImg
    initalTutorialSprite.collider = 'n'
    initalTutorialSprite.x = windowWidth/2
    initalTutorialSprite.y = windowHeight/2
    initalTutorialSprite.w = 800
    initalTutorialSprite.h = 600

    gameOver = new Group()
    gameOverBackground = new gameOver.Sprite()
    gameOverBackground.image = gameOverBgImg
    gameOverBackground.collider = 'n'
    gameOverBackground.x = windowWidth/2
    gameOverBackground.y = windowHeight/2

    retry = new gameOver.Sprite()
    retry.image = retryImg
    retry.collider = 's'
    retry.x = windowWidth/2
    retry.y = windowHeight/2 - 70
    retry.w = 460
    retry.h = 150
    retry.image.scale = 0.5

    returnToMenu = new gameOver.Sprite()
    returnToMenu.image = returnToMenuImg
    returnToMenu.collider = 's'
    returnToMenu.x = windowWidth/2
    returnToMenu.y = windowHeight/2 + 90
    returnToMenu.w = 460
    returnToMenu.h = 150
    returnToMenu.image.scale = 0.5
} 

function drawLevel(){
    if(level1){
        level1.removeAll()
    }
    level1 = new Tiles ([
		"JBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBJBBBBBBBBBBBBBBBBBBBBBBBJBBBBBBBBBBBBBBBJBBBBBBBJ",
        "C..............................C.......................................C.......C",
        "C..............................C.......................................C.......C",
        "C..............................C.......................................C....x..C",
        "C..............................C.......................u...............C.......C",//gate 0
        "C..............................C.......................................C.......C",
        "C..............................C.......................................C.......C",
        "C..............................C.......................................C.......C",
        "C............e.................C.......................C...............C.......C",//enemy id = 0
        "C..............................C.......................C...............C.......C",
        "C..............................C.......................C...............C.......C",
        "C..............................C.......................C...............C.......C",
        "C..............................C.......................C...............C.......C",
        "C..............................C.......................C...............C.......C",
        "C..............................C.......................C...............C.......C",
        "C..............................C............e..........C...............C.......C",//enemy id = 1
        "J...t...JBBBBBBBJ..............C.......................C...............C.......C",//gate 1
        "C...............C..............C.......................C...............C.......C",
        "C...............C..............C.......................C...............C.......C",
        "C...............C........e.....C.......................C...............C.......C",//enemy id = 2
        "C...............C..............C.......................C...............C.......C",
        "C...............C..............C.......................C...............C.......C",
        "C...............C..............C.......................C...............C.......C",
        "C...............C..............C.......................C...............J.......C",
        "C...............C..............C.......................C.......................C",
        "C...............C..............C.......................C.......................C",
        "C...............C..............C.......................C.......................C",
        "C...............C...x..........C.......................C.......................C",
        "C.......e.......C..............C.......................C...........e...........C",//enemy id = 3 AND enemy id = 4
        "C...............C..............C.......................C.......................C",
        "C...............C..............C.......................C.......................C",
        "C...............JBBBBBBBBBBBBBBJ.......................C.......................C",
        "C..............................C.......................C.......................C",
        "C..............................C.......................C.......................C",
        "C..............................C.......................C.......................C",
        "C..............................C.......................C.......................C",
        "C..............................C............e..........C.......................C",//enemy id = 5
        "C..............................C.......................C.......................C",
        "C..............................C.......................C.......................C",
        "C..............................C.......................C.......................C",
        "C..............................J.......................C.......................C",
        "C......................................................C.......................C",
        "C......................................................C.......................C",
        "C......................................................C.......................C",
        "C..............................u.......................C............e..........C",//enemy id = 6 //gate 2
        "C......................................................C.......................C",
        "C......................................................C.......................C",
        "C......................................................C.......................C",
        "JBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBJBBBBBBBBBBBBBBBBBBBBBBBJBBBBBBBJ...t...JBBBBBBBJ",//gate 3
        "C..............................C...............................C...............C",
        "C..............................C...............................C...............C",
        "C..............................C...............................C...............C",
        "C..............................C...........................x...C...............C",
        "C..........................x...C...............................C...............C",
        "C..............................C...............................C...............C",
        "C..............................C...............................C...............C",
        "C...............JBBBBBBBBBBBBBBJ...............................C...............C",
        "C..............................C...............................C...............C",
        "C..................e...........C...............................C...............C",//enemy id = 7
        "C..............................C...............................C...............C",
        "C..............................C...............................C...............C",
        "C..............................C...............................C...............C",
        "C..............................C...............................C...............C",
        "C..............................C........................JBBBBBBJ...............C",
        "C..............................J...............................................C",
        "C..............................................................................C",
        "C..............................................e...............................C",//enemy id = 8
        "C..............................................................................C",
        "C..............................u...............................................C",//gate 4
        "C..............................................................................C",
        "C..............................................................................C",
        "C..............................................................................C",
        "C..............................J...............................................C",
        "C..............................C...............................................C",
        "C..............................C...............................................C",
        "C.......m......................C...................................e...........C",//enemy id = 9
        "C..............................C...............................................C",
        "C..............................C...............................................C",
        "C..............................C...............................................C",
        "JBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBJBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBJ",
	],32,32,32,32)

    for(let i = 0; i < enemy.length; i++){
        enemy[i].id = i
    }

    for(let z = 0; z < gate.length; z++){
        gate[z].id = z
    }

    gateFeatureAssignment()
}

function draw(){
    if(gameState == "Menu"){
        menu.collider = 's'
        background(menuBackgroundImage)
        menu.draw()
        if(playButton.mouse.hovering()){
            playButton.scale = 0.8
        }
        else if(!playButton.mouse.hovering()){
            playButton.scale = 0.7
        }

        if(quitButton.mouse.hovering()){
            quitButton.scale = 1.09
        }
        else if(!quitButton.mouse.hovering()){
            quitButton.scale = 0.99
        }

        if(tutorialButton.mouse.hovering()){
            tutorialButton.scale = 1.7
        }
        else if(!tutorialButton.mouse.hovering()){
            tutorialButton.scale = 1.6
        }
    }
    else if(gameState == "playing"){
        camera.off()
		background(waterImg)
		menu.collider = 'n'
		tutorial.collider = 'n'
        gameOver.collider = 'n'
        initalTutorialSprite.collider = 'n'
        pauseMenu.collider = 'n'
        levelComplete.collider = 'n'
        tutorialExit.collider = 'n'
        retry.collider = 'n'
        returnToMenu.collider = 'n'
        gameOverBackground.collider = 'n'


        //camera is set on the player
        camera.on()
        camera.x = player.x;
        camera.y = player.y;
        camera.zoom = 2

        
        gameTiles.draw()
		player.draw()
		cannonBall.draw()
        enemy.draw()
        enemyCannonBall.draw()
        gate.draw()
        explosionGraphics.draw()//draw the explosion for the cannon hitting the enemy

        for(k of key){ //draw the keys for the gates
            k.draw()
        }

        //draw the text for the number of coins the player has
        camera.off()
        fill('white')
        text("🪙"+coins,50,60)
        stroke('white')
        strokeWeight(0)
        textSize(60)
        camera.off()
        
        // Draw health bar background
        fill(200)
        rect(windowWidth - 250, 65, 200, 20)
        
        // Draw health bar fill
        fill(255, 0, 0)
        rect(windowWidth - 250, 65, (player.playerHealth / 100) * 200, 20)
        
        // Draw health bar border
        stroke(0)
        strokeWeight(2)
        noFill()
        rect(windowWidth - 250, 65, 200, 20)
        camera.off()

        //tells the player they cannot shoot at this current moments as the cannons are being reloaded
        if(cannonTimer == 0){
            camera.off()
            fill('black')
            text("RELOADING...",windowWidth/2-100,windowHeight/2+400)
            textSize(60)
            camera.off()
        }

        //draw the prompting the player to pick up the treasure
         if(player.overlapping(treasure)){
            camera.off()
            fill(0)
            text("Press F to pick up",windowWidth/2,windowHeight/2)
            textSize(60)
            camera.on()
        }

        if(tutorialScreenCounter === 0){ //show the inital tutorial screen only once
            initalTutorialSprite.draw()
            camera.off()
            fill('white')
            text("Press ENTER to continue",windowWidth/3,windowHeight/2+300)
            stroke('white')
            strokeWeight(0)
            textSize(60)
            camera.off()

            if(kb.presses('enter')){ //close the inital tutorial screen when the player presses enter
                initalTutorialSprite.remove()
                tutorialScreenCounter += 1 //increment the tutorial screen counter so it doesnt show again
            }
        }
        else if(tutorialScreenCounter === 1){ //if the tutorial screen has been shown already turn the game physics back on
            world.step() 
        }
	}

    else if(gameState == "pause"){
        pauseMenu.draw()
        resumeButton.draw()
        exitToMenuButton.draw()
        exitToMenuButton.collider = 's'
        resumeButton.collider = 's'
        pauseMenu.collider = 's'
    }
    else if(gameState == "tutorial"){
        tutorial.draw()
        tutorial.collider = 's'
        tutorialExit.draw()
        tutorialExit.collider = 's'
    }

    else if(gameState == "gameOver"){
        gameOver.draw()
        retry.collider = 's'
        returnToMenu.collider = 's'
        gameOverBackground.collider = 's'
    }

    else if(gameState == "levelComplete"){ //when the level is complete show the draw the level complete screen
        levelComplete.draw()
        levelComplete.collider = 's'
        fill('white')
        text("You have collected "+coins+" coins",windowWidth/2-400,windowHeight/2)
        stroke('white')
        strokeWeight(0)
        textSize(60)
    }
}

function update(){
    if(gameState == "Menu"){

        backgroundMusic.stop() //stop the background music when in the menu
        //when the game state is set to "Menu" handle button presses for each button

        //when the player presses the play button the game state is set to "playing"
        if(playButton.mouse.hovering() && mouse.presses()){

            // clear and prepare map for a new game
            enemy.removeAll()
            cannonBall.removeAll()
            enemyCannonBall.removeAll()
            key.removeAll()
            explosionGraphics.removeAll()

            gatesUnlocked = [false,false,false,false,false]  //reset the gates unlocked array so all gates are locked again when starting a new game
            tutorialScreenCounter = 0 //reset the tutorial screen counter so the tutorial screen will show again for the new game
            player.playerHealth = 100; //reset the player health to 100 when starting a new game
            player.image = playerShip //reset the player image to the undamaged ship when starting a new game
            coins = 0 //reset the coins to 0 when starting a new game

            //run initial functions to set up the level
            gameState = "playing"
            drawLevel()
            addCannon()
            wind()

            //generate a wind different wind direction every time the level is opened
            windDirection = Math.floor(random(0,9))

            if(player.playerHealth <= 0){
                gameState = "gameOver"
            }
        }

        //when the player presses the tutorial menu button the tutorial menu is opened
        if(tutorialButton.mouse.hovering() && mouse.presses()){
            gameState = "tutorial"
            tutorial.collider = 's'
            tutorialExit.collider = 's'
        }

        //when the user presses the quit button the game is closed
        if(quitButton.mouse.hovering() && mouse.presses()){
            window.close();
        }
    }

    else if(gameState == "playing"){ // main game loop
        collectTreasure() //call the collect treasure function
        playerMovement() //call the player movement function
		playerCombat() //call the player combat function 
        enemyMovement() //call the enemy movement function
        cannonBallCollision() //call the cannon ball collision function
        visualDamage()
        
        backgroundMusic.volume = 0.3 //set the background music volume to a low level
        if(!backgroundMusic.isPlaying()){ //if the background music is not playing play it
            backgroundMusic.play()
        }

        //when the player presses the P key the game is paused
        if(kb.presses('p')){ 
            gameState = 'pause'
            console.log(gameState)
        }

        if(enemy.length == 0){
            gameState = "levelComplete"
        }
    }

    else if(gameState == "tutorial"){
        //when the player presses the tutorial menu exit button the tutorial menu is closed
        if(tutorialExit.mouse.hovering() && mouse.presses()){
            gameState = "Menu"
            tutorial.collider = 'n'
            tutorialExit.collider = 'n'
        }
    }

    else if(gameState == 'pause'){
        pauseMenuButtons()
        backgroundMusic.pause() //pause the background music
    }

    else if(gameState == 'gameOver'){

        backgroundMusic.pause() //pause the background music
 

        if(retry.mouse.hovering() && mouse.presses()){
            // clear and prepare map for a new game
            enemy.removeAll()
            cannonBall.removeAll()
            enemyCannonBall.removeAll()
            key.removeAll()
            explosionGraphics.removeAll()
            gameTiles.removeAll()

            gatesUnlocked = [false,false,false,false,false]
            tutorialScreenCounter = 0
                
            gameState = "playing"
            drawLevel()
            addCannon()
            wind()

            player.playerHealth = 100; //reset the player health to 100 when starting a new game
            player.image = playerShip; //reset the player image to the undamaged ship
            coins = 0; //reset the coins to 0 when starting a new game

            //generate a wind different wind direction every time the level is opened
            windDirection = Math.floor(random(0,9))

            if(player.playerHealth <= 0){
                gameState = "gameOver"
            }
        }
        else if(returnToMenu.mouse.hovering() && mouse.presses()){
            gameState = "Menu"
            returnToMenu.collider = 'n'
            retry.collider = 'n'
            gameOverBackground.collider = 'n'
            menu.collider = 's'
        }
    }

    else if(gameState == "levelComplete"){
        if(levelCompleteBackToMenu.mouse.hovering() && mouse.presses()){
            levelCompleteBackToMenu.collider = 'n'
            levelCompleteBackground.collider = 'n'
            levelComplete.collider = 'n'
            gameState = "Menu"
            menu.collider = 's'
        }
    }
}

function playerMovement(){
    player.rotationLock = true;

    if(kb.pressing('W')){ //if player presses W the ship accelerates
        player.speed = 2
    }
    else{ //if not then the player speed will be 0
        player.speed = 0
    }

    if(kb.pressing('D')){ //if player presses D the ship turns right
        player.rotation -= 1
        player.direction = player.rotation
        player.rotationLock = false;
    }
    else if(kb.pressing('A')){ //if player presses A the ship turns left
        player.rotation += 1
        player.direction = player.rotation
        player.rotationLock = false;
    }

    //ensure ship doesnt bounce of the walls
    player.direction = player.rotation
    player.bounciness = 0
}

function playerCombat(){
   
    if(kb.pressed('spacebar') && cannonTimer >= 1 ){ // frontcannon 
        c = new cannonBall.Sprite(player.x,player.y)
        c.rotation = player.rotation
        c.direction = player.direction
        c.speed = 5
        c.life = 240
        cannonTimer = 0 //reset the cannon timer
        shot.play()
    }
    else if(kb.pressed('e') && cannonTimer >= 1){ //left broadside
        c = new cannonBall.Sprite(leftBroadside2.x,leftBroadside2.y)
        c.direction = player.direction +90
        c.speed = 5
        c.life = 240
        cannonTimer = 0 //reset the cannon timer
        shot.play()
    }
    else if(kb.pressed('q') && cannonTimer >= 1){ //right broadside
        c = new cannonBall.Sprite(rightBroadside2.x,rightBroadside2.y)
        c.direction = player.direction -90
        c.speed = 5
        c.life = 240
        cannonTimer = 0 //reset the cannon timer
        shot.play()
    }

    for(c of cannonBall){
        if(c.overlaps(verticalWall)){
            c.remove()
        }

        if(c.overlaps(horizontalWall)){
            c.remove()
        }

        if(c.overlaps(tower)){
            c.remove()
        }

        if(c.overlaps(gate)){
            c.remove()
        }

        if(c.overlaps(gateHorizontal)){
            c.remove()
        }

        if(c.velocity == 0){
            c.remove()
        }
    }
}

function pauseMenuButtons(){
    if(resumeButton.mouse.hovering() && mouse.presses()){
        gameState = "playing"
    }
    else if(exitToMenuButton.mouse.hovering() && mouse.presses()){
        gameState = "Menu"
        exitToMenuButton.collider = 'n'
        resumeButton.collider = 'n'
        pauseMenu.collider = 'n'

        menu.draw()
        world.step()
    }
}

function addCannon(){

    // Clear old joints
    for(let gj of glueJoints){
        gj.remove()
    }
    glueJoints = []
    
    // Clear old cannons if they exist
    if(cannons){
        cannons.removeAll()
    }

    //left broadside cannon ball release point
    cannons = new Group()
    leftBroadside1 = new cannons.Sprite()
    leftBroadside1.x = player.x - 12
    leftBroadside1.y = player.y + 14
    leftBroadside1.visible = false;
    leftBroadside1.w = 10
    leftBroadside1.h = 10
    leftBroadside1.collider = 'd'

    leftBroadside2 = new cannons.Sprite()
    leftBroadside2.x = player.x
    leftBroadside2.y = player.y + 14
    leftBroadside2.visible = false;
    leftBroadside2.w = 10
    leftBroadside2.h = 10
    leftBroadside2.collider = 'd'

    leftBroadside3 = new cannons.Sprite()
    leftBroadside3.x = player.x + 12
    leftBroadside3.y = player.y + 14
    leftBroadside3.visible = false;
    leftBroadside3.w = 10
    leftBroadside3.h = 10
    leftBroadside3.collider = 'd'

    //right broadside cannon ball release point
    rightBroadside1 = new cannons.Sprite()
    rightBroadside1.x = player.x + 12
    rightBroadside1.y = player.y + 14
    rightBroadside1.visible = false;
    rightBroadside1.w = 10
    rightBroadside1.h = 10
    rightBroadside1.collider = 'd'

    rightBroadside2 = new cannons.Sprite()
    rightBroadside2.x = player.x
    rightBroadside2.y = player.y + 14
    rightBroadside2.visible = false;
    rightBroadside2.w = 10
    rightBroadside2.h = 10
    rightBroadside2.collider = 'd'

    rightBroadside3 = new cannons.Sprite()
    rightBroadside3.x = player.x - 12
    rightBroadside3.y = player.y + 14
    rightBroadside3.visible = false;
    rightBroadside3.w = 10
    rightBroadside3.h = 10
    rightBroadside3.collider = 'd'

    glueJoints.push(new GlueJoint(rightBroadside1, player))
    glueJoints.push(new GlueJoint(rightBroadside2, player))
    glueJoints.push(new GlueJoint(rightBroadside3, player))
    glueJoints.push(new GlueJoint(leftBroadside1, player))
    glueJoints.push(new GlueJoint(leftBroadside2, player))
    glueJoints.push(new GlueJoint(leftBroadside3, player))

	player.overlaps(cannons)
	cannons.overlaps(cannons)
	cannonBall.overlaps(cannons)
}

//handles the player collecting the coins
function collectTreasure(){
    for(t of treasure){
        if(player.overlapping(t)){
            if(kb.pressed('F')){ //check if the player presses F to collect the treasure
                coins += (Math.floor(random(10,100))) //generate a random amount of coins found in the treasure 
                t.remove()//remove the treasure after the player collected it
                camera.off()
                fill('yellow')
                alertSound.play()
                text("You Collected " + coins +"!", windowWidth/2-100, windowHeight/2+400)
                textSize(60)
                camera.off()
            }
        }
    }
}

//feature to control the wind and how it effects the players speed depending on the direction they are going
function wind(){

    if(windDirection ==1){ //wind coming from north
        world.gravity.y = 2

    }

    else if(windDirection ==2){ //wind coming from north east
        world.gravity.y = 2
        world.gravity.x = 2

    }

    else if(windDirection ==3){ //wind coming from east
        world.gravity.x = 2

    }

    else if(windDirection ==4){ //wind coming from south east
        world.gravity.x = 2
        world.gravity.y = -2

    }

    else if(windDirection ==5){ //wind coming from south
        world.gravity.y = -2
        
    }

    else if(windDirection ==6){ //wind coming from south west
        world.gravity.y = -2
        world.gravity.x = -2

    }

    else if(windDirection ==7){ //wind coming from west
        world.gravity.x = -2

    }

    else if(windDirection ==8){ //wind coming from north west
        world.gravity.x = -2
        world.gravity.y = 2
        
    }
    player.direction = player.rotation //ensures the player is stil facing the correct direction
}

//handles the movement for the enemy
function enemyMovement(){
    for(e of enemy){ //loop through all the enemies on the map
        let sprites = world.rayCastAll(e,player, (sprite) => sprite.isWall)//use raycasting to check whenever a sprite is a target THE PLAYER or a object which cant be seen through
        for(sprite of sprites){ //loop through all the sprites
            if(sprite.isTarget){ //check if a sprite is a target
                e.direction = e.angleTo(player) //angle the enemy towards the player
                e.rotateMinTo(e.direction,1)
                e.speed = 0.5 //allow the enemy to move in the direction of the player
            }
        }
    }
}


//allows the enemy to shoot at the player
function enemyAttack(){
    if(gameState == "playing"){ //check if the game is playing

        for(ec of enemyCannonBall){
            if(ec.collides(verticalWall) || ec.collides(horizontalWall) || ec.collides(tower) || ec.collides(gate)){ //if the enemy cannon balls hit one of these tiles the cannon ball that hit it is removed
                ec.remove()
            }
        }

        for(e of enemy){
            if(dist(player.x,player.y,e.x,e.y)< 500){
                //shoot an enemy bullet at the player 
                let ec =   new enemyCannonBall.Sprite(e.x,e.y)
                ec.speed = 5
                ec.direction = e.direction
                shot.play()
            }
        }
    }
}

function cannonBallCollision(){
    for(e of explosionGraphics){
        if(e.opacity>0){
            e.opacity -=0.005
        }         
    }
}

function gateFeatureAssignment(){ //assign keys to enemies based on the enemy inventory
    // replace 0 with level number
    console.log(enemyInventory[0].length) //number of enemies in level 1
    console.log(enemy.length) //number of enemy sprites created
    for(let i = 0; i < enemyInventory[0].length;i++){ //loop through the enemy inventory for level 1
        console.log(enemyInventory[0][i]) //log the enemy inventory for level 1
        if(enemyInventory[0][i][0] == true){ //check if the enemy has a key

            console.log(enemy[i].hasKey) //log the enemy's key status
            enemy[i].hasKey = true //set the enemy's key status to true
            //level, enemyIndex, gateIndex
            enemy[i].gate = enemyInventory[0][i][1] //assign the gate index to the enemy
            console.log("enemy "+i+" has key for gate "+enemy[i].gate) //log the enemy's gate assignment

        }else{
            enemy[i].hasKey = false //set the enemy's key status to false
        }
    }
}

function visualDamage(){
    if(player.playerHealth <= 75){
        player.image = damage1
    }
    if(player.playerHealth <= 50 && player.playerHealth > 25){
        player.image = damage2
    }
    if(player.playerHealth <= 25 && player.playerHealth > 5){
        player.image = damage3
    }
    if(player.playerHealth <= 5 && player.playerHealth > 0){
        player.image = damage4
    }
}
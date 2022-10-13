import { Application, Sprite, InteractionEvent } from "pixi.js"
import React, { useEffect, useRef } from "react"

class Point {
    x: number = 0
    y: number = 0

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
}

export default function PIXIComponent() {
    const ref = useRef<HTMLDivElement>(null)

    const tileMap: Array<Array<number>> = [
        [1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1],
    ]

    const tile = {
        height: 25,
        width: 25
    }

    function convertIsoTo2D(point: Point): Point {
        let tempX: number = (2 * point.y + point.x) / 2
        let tempY: number = (2 * point.y - point.x) / 2
        return new Point(tempX, tempY)
    }

    function convert2DToIso(point: Point): Point {
        let tempX: number = point.x - point.y
        let tempY: number = (point.x + point.y) / 2
        return new Point(tempX, tempY)
    }

    function getTileCoordinates(point: Point, tileHeight: number): Point {
        let tempX: number = Math.floor(point.x / tileHeight)
        let tempY: number = Math.floor(point.y / tileHeight)
        return new Point(tempX, tempY)
    }


    useEffect(() => {
        const app = new Application({
            width: 800,
            height: 600,
            backgroundColor: 0x5BBA6F,
            resolution: 1
        })

        ref.current?.appendChild(app.view)
        app.start()

        tileMap.forEach((rowData, rowIndex) => {
            rowData.forEach((colData, colIndex) => {
                let x = rowIndex * tile.width
                let y = colIndex * tile.height
                let tileType: number = tileMap[rowIndex][colIndex]
                placeTile(tileType, convert2DToIso(new Point(x, y)))
            });
        });

        function placeTile(tileType: number, point: Point): void {
            const sprite = Sprite.from('tile.png');
            sprite.height = 50
            sprite.width = 50
            sprite.position.set(point.x + 300, point.y + 100)
            sprite.interactive = true
            sprite.on("mousedown", (e: InteractionEvent) => {
                console.log(e)
                console.log(getTileCoordinates(convertIsoTo2D(new Point(e.data.global.x, e.data.global.y)), tile.height))
            })
            app.stage.addChild(sprite)
        }

        return () => {
            app.destroy(true, true)
        }
    }, [])

    return <div ref={ref} />
}
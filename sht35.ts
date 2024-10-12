/**
 * Custom blocks
 */
//% weight=100 color=#0fbc11 icon="" block="温湿度センサ(SHT35)"
namespace IML_SHT35 {

    let I2C_ADDR = 0x45

    //% block
    //% block="温度"
    //% weight=100    
    export function getTemp(): number {
        return Math.round(gettemp() * 10) / 10
    }
    //% block
    //% block="湿度"
    //% weight=100    
    export function getHum(): number {
        return Math.round(gethum() * 10) / 10
    }

    // I2C 書き込み関数
    function i2cWrite(command: number) {
    pins.i2cWriteNumber(I2C_ADDR, command, NumberFormat.UInt16BE)
    }

    // I2C 読み取り関数
    function i2cRead(num: number): Buffer {
        return pins.i2cReadBuffer(I2C_ADDR, num)
    }

    // ソフトリセット
    function softReset() {
        i2cWrite(0x30A2)
        basic.pause(10) // センサーの準備を待つ
    }

    // 温度と湿度の取得
    function gettemp() : number {
        let data = pins.createBuffer(6)

        // 測定開始コマンドを送信
        i2cWrite(0x2C06)
        basic.pause(500) // データが準備されるまで待機

        // データを読み取る
        data = i2cRead(6)

        // 温度データを計算
        let temperature = (data[0] << 8) | data[1]
        temperature = -45.0 + (175.0 * temperature / 65535.0)
        return temperature;
    }
    function gethum() : number {
        let data = pins.createBuffer(6)

        // 測定開始コマンドを送信
        i2cWrite(0x2C06)
        basic.pause(500) // データが準備されるまで待機

        // データを読み取る
        data = i2cRead(6)

        // 湿度データを計算
        let humidity = (data[3] << 8) | data[4]
        humidity = 100.0 * humidity / 65535.0
        return humidity
    }

    // 初期化
    softReset()
}

import { IconCircle, IconCircleFilled } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default ({ id }: {
  id: string
}) => {
  const [headers, setHeaders] = useState<string[]>(["Letra", "Nombre", "Apellido", "Color", "Fruta", "Total"]);

  const [status, setStatus] = useState<"Disconnected" | "Loading" | "OK">("Loading")
  const [ms, setMS] = useState<number>(500)

  function timeout(ms, promise): Promise<Response> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('TIMEOUT'))
      }, ms)

      promise
        .then(value => {
          clearTimeout(timer)
          resolve(value)
        })
        .catch(reason => {
          clearTimeout(timer)
          reject(reason)
        })
    })
  }


  const getGameData = (): Promise<number> => new Promise(async (resolve, reject) => {
    try {
      const start = Date.now()
      const data = await timeout(200, fetch('/', {
        priority: "high"
      }))
      if (data.ok) {
        resolve(Date.now() - start)
      } else throw new Error()
    } catch {
      reject(false)
    }
  })

  const wait = () => new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true)
    }, 500);
  })

  const infiniteLoopGame = async () => {
    while (true) {
      try {
        let lastMs = await getGameData();
        setMS(prev => Math.round((lastMs + prev) / 2))
        setStatus("OK")
        console.log('Datos actualizados')
      } catch {
        setStatus("Disconnected")
        console.log('No se pudieron actualizar los datos del juego')
      }

      await wait();
    }
  }

  useEffect(() => {
    infiniteLoopGame();
  }, [])

  return <>
    <p className="flex gap-1">Estado: {(() => {
      switch (status) {
        case "Loading":
          return <p className="flex items-center gap-1">
            <IconCircleFilled size={15} className="text-orange-400" />
            {ms}ms
          </p>
        case "Disconnected":
          return <p className="flex items-center gap-1">
            <IconCircleFilled size={15} className="text-red-400" />
            {ms}ms
          </p>
        case "OK":
          return <p className="flex items-center gap-1">
            <IconCircleFilled size={15} className="text-green-400" />
            {ms}ms
          </p>

      }
    })()}</p>
    <div className="flex flex-col gap-4 rounded bg-slate-50 h-full w-full overflow-scroll p-4">
      <div
        style={{
          gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))`
        }}
        className="grid gap-2"
      >
        {
          headers.map((header) => (
            <div className="bg-white p-3 text-center font-semibold tracking-wide">
              {header}
            </div>
          ))
        }
      </div>
      <div style={{
        gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))`
      }} className="grid gap-2">
        {
          headers.map((_, i) => (
            <div className="bg-white p-2 text-center tracking-wide">
              <input type="text" placeholder="..." />
            </div>
          ))
        }
      </div>
      <button className="bg-blue-400 w-full max-w-[400px] mx-auto p-2 rounded text-white font-semibold text-2xl">STOP</button>
    </div>
  </>
}
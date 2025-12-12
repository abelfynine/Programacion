import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';
import sheetIdStore from '../../../store/sheetIdStore'
import useAuthStore from '../../../store/authStore';

// ID del cliente de Google y permisos necesarios para Drive y Sheets
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPES = "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets"

const Inicio = () => {
  // Estado de autenticación
  const { isLoggedIn, setIsLoggedIn } = useAuthStore();
  // Estado del ID de la hoja de cálculo
  const { sheetId, setSheetId } = sheetIdStore();
  // Indica si la hoja existe
  const [fileExists, setFileExists] = useState(false);
  // Controla si el usuario intentó crear la hoja
  const [userClickedCreate, setUserClickedCreate] = useState(false);
  // Indica si se está verificando el archivo
  const [fileCheckLoading, setFileCheckLoading] = useState(true);
  // Indica si se está verificando la auth
  const [authLoading, setAuthLoading] = useState(true)
  // Mensajes de estado o error
  const [message, setMessage] = useState('');

  // Función para manejar el cambio de estado de autenticación
  const updateSigninStatus = (isSignedIn) => {
    setIsLoggedIn(isSignedIn);
  };

  // Cargar la API de Google al iniciar el componente
  // Se ejecuta una sola vez cuando inicia la app
  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: CLIENT_ID,
        scope: SCOPES,
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
      }).then(() => {
        const authInstance = gapi.auth2.getAuthInstance();
        const logged = authInstance.isSignedIn.get();

        setIsLoggedIn(logged);
        authInstance.isSignedIn.listen(updateSigninStatus);
        setAuthLoading(false)
      });

    };
    setFileCheckLoading(false);

    gapi.load("client:auth2", initClient);
  }, []);  // Solo 1 vez

  // Este se ejecuta solo cuando el usuario inicia sesión
  useEffect(() => {
    // Solo si el usuario está logueado
    if (!isLoggedIn) return;
    if (!sheetId) {
      // Marca que no hay archivo si no hay sheetId
      setFileExists(false);
      return;
    }

    const verifyFile = async () => {
      // Indica que se está verificando el archivo
      setFileCheckLoading(true);
      try {
        await gapi.client.load("drive", "v3");
        // Obtiene información del archivo en Google Drive
        const driveRes = await gapi.client.drive.files.get({
          fileId: sheetId,
          fields: "id, trashed, explicitlyTrashed",
        });

        // Si el archivo está en la papelera, marca como inexistente
        if (driveRes.result.trashed) {
          setFileExists(false);
          setSheetId(null);
        } else {
          setFileExists(true);
        }

      } catch (e) {
        console.error(e);
        setFileExists(false);
        setSheetId(null);
      }
      setFileCheckLoading(false); // Finaliza la verificación
    };
    verifyFile();

  }, [isLoggedIn, sheetId]);  // solo cuando cambia

  // Iniciar sesión con Google
  const handleSignIn = () => {
    gapi.auth2.getAuthInstance().signIn({ prompt: 'select_account' });
  };

  // Desconectarse de Google
  const handleSignOut = () => {
    gapi.auth2.getAuthInstance().signOut();
  };

  const createSpreadsheet = async () => {
    // Usuario hizo clic
    setUserClickedCreate(true);
    try {
      // Si ya existe en Zustand, verificar si sigue existiendo en Google
      if (sheetId) {
        try {
          await gapi.client.sheets.spreadsheets.get({
            spreadsheetId: sheetId,
          });
          setFileExists(true);
          return; // No creamos otro archivo
        } catch (error) {
          setSheetId(null);
          setFileExists(false);
        }
      }

      // Crea una archivo en Google Sheets
      const response = await gapi.client.sheets.spreadsheets.create({
        properties: {
          title: "Control Inventario App",
        },
      });

      // Guarda el ID del archivo creado y marca que el archivo existe
      const spreadsSheetId = response.result.spreadsheetId
      setSheetId(spreadsSheetId)
      setFileExists(true);

      // Asegurar de que el ID de la hoja de cálculo esté asignado antes de continuar
      if (spreadsSheetId) {
        await createInventoryStructure(spreadsSheetId);
      } else {
        console.error('No se pudo obtener el ID de la hoja de cálculo.');
      }

    } catch (err) {
      console.error('Error al crear la hoja de cálculo: ', err);
    }
  };

  // Comprobar si la estructura de inventario ya está creada
  const checkIfStructureExists = async (sheetId) => {
    try {
      const response = await gapi.client.sheets.spreadsheets.get({
        spreadsheetId: sheetId,
      });
      const sheets = response.result.sheets;

      const hasInventorySheet = sheets.some(sheet => sheet.properties.title === 'Inventario');
      const hasEntriesSheet = sheets.some(sheet => sheet.properties.title === 'Entradas');
      const hasExitsSheet = sheets.some(sheet => sheet.properties.title === 'Salidas');

      return hasInventorySheet && hasEntriesSheet && hasExitsSheet;
    } catch (error) {
      console.error('Error checking if structure exists:', error);
      return false;
    }
  };

  // Crear estructura de inventario
  const createInventoryStructure = async (sheetId) => {
    try {
      // Comprobar si la estructura ya está creada
      const exists = await checkIfStructureExists(sheetId);
      if (exists) {
        setMessage('La estructura de inventario ya está creada.');
        return;
      }

      // Renombrar la primera hoja a "Inventario"
      // Y agregar las hojas de "Entradas" y "Salidas"
      await gapi.client.sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetId,
        resource: {
          requests: [
            {
              updateSheetProperties: {
                properties: {
                  sheetId: 0, // ID de la primera hoja
                  title: 'Inventario',
                },
                fields: 'title',
              },
            },
            {
              addSheet: {
                properties: {
                  title: 'Entradas',
                }
              }
            },
            {
              addSheet: {
                properties: {
                  title: 'Salidas',
                }
              }
            },
          ]
        }
      });

      // Agregar las columnas a la hoja "Inventario"
      await gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: 'Inventario!A1:F1',
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [
            ['Codigo', 'Descripcion', 'Existencia', 'Entradas', 'Salidas', 'Stock']
          ]
        },
      });

      // Agregar las columnas a la hoja "Entradas"
      await gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: 'Entradas!A1:E1',
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [
            ['N° Factura', 'Fecha', 'Codigo', 'Descripcion', 'Cantidad']
          ]
        },
      });

      // Agregar las columnas a la hoja "Salidas"
      await gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: 'Salidas!A1:E1',
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [
            ['N° Factura', 'Fecha', 'Codigo', 'Descripcion', 'Cantidad']
          ]
        },
      });

      setMessage('Estructura de inventario creada con éxito.');
    } catch (error) {
      console.error('Error al crear la estructura de inventario:', error);
      setMessage('Error al crear la estructura de inventario.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Google Sheets</h2>
      {/* Verifica la autenticación */}
      {authLoading ? (
        <p className="mt-4 text-blue-500">Cargando autenticación...</p>
      ) : 
      // Si no está logueado, mostrar botón de inicio de sesión 
      !isLoggedIn ? (
        <button onClick={handleSignIn} className="bg-blue-500 text-white px-4 py-2 rounded">
          Iniciar sesión con Google
        </button>
      ) : (
        <>
          {/* Botón para cerrar sesión */}
          <button onClick={handleSignOut} className="bg-red-500 text-white px-4 py-2 rounded">
            Cerrar sesión de Google
          </button>
          <div className="mt-4">
            <label className="block">Este boton crea un archivo llamado 'Control Inventario App' en Google Sheets</label>
            {/* Muestra estado de verificación o acción según exista el archivo */}
            {fileCheckLoading ? (
              <p className="mt-4 text-blue-500">Verificando...</p>
            ) : fileExists ? (
              !userClickedCreate && (
                <p className="mt-4 text-blue-500">El archivo ya existe, usando el mismo.</p>
              )
            ) : (
              <button
                onClick={createSpreadsheet}
                className="bg-green-500 text-white px-4 py-2 mt-1 rounded"
              >
                Crear Archivo
              </button>
            )}
            {/* Muestra mensajes de estado o error */}
            {message && <p className="mt-4 text-blue-500">{message}</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default Inicio;
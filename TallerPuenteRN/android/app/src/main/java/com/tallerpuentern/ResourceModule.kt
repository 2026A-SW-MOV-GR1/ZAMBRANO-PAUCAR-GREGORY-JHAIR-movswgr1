package com.tallerpuentern

import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ResourceModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ResourceBridge"
    }

    @ReactMethod
    fun getDynamicResources(promise: Promise) {
        try {
            val context = reactApplicationContext
            val packageName = context.packageName

            // Obtener el Texto
            val stringId = context.resources.getIdentifier("taller_saludo", "string", packageName)
            val textValue = if (stringId != 0) context.getString(stringId) else "Texto no encontrado"

            // Obtener el Color del Texto
            val textColorId = context.resources.getIdentifier("taller_color_texto", "color", packageName)
            val textColorHex = if (textColorId != 0) String.format("#%06X", 0xFFFFFF and ContextCompat.getColor(context, textColorId)) else "#000000"

            // Obtener el Color del Fondo
            val bgColorId = context.resources.getIdentifier("taller_color_fondo", "color", packageName)
            val bgColorHex = if (bgColorId != 0) String.format("#%06X", 0xFFFFFF and ContextCompat.getColor(context, bgColorId)) else "#FFFFFF"

            // Empaquetar todo en un JSON
            val map = Arguments.createMap()
            map.putString("texto", textValue)
            map.putString("colorTexto", textColorHex)
            map.putString("colorFondo", bgColorHex)

            promise.resolve(map)
        } catch (e: Exception) {
            promise.reject("ERROR_PUENTE", "Fallo al leer recursos", e)
        }
    }
}
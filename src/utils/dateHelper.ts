import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

class DateHelper {
  // Obtener fecha local actual
  static getLocalDate(): Date {
    return dayjs().toDate()
  }

  static getLocalDateFormatted(format: string = 'YYYY-MM-DD HH:mm:ss'): string {
    return dayjs().format(format)
  }

  static formatDate(
    date: Date | string,
    format: string = 'YYYY-MM-DD HH:mm:ss'
  ): string {
    return dayjs(date).format(format)
  }

  static startOfDay(date: Date | string = new Date()): Date {
    return dayjs(date).startOf('day').toDate()
  }

  static endOfDay(date: Date | string = new Date()): Date {
    return dayjs(date).endOf('day').toDate()
  }

  static getTodayRange(): { inicio: Date; fin: Date } {
    return {
      inicio: this.startOfDay(),
      fin: this.endOfDay()
    }
  }

  // 🔥 Nuevo: convertir fechas UTC ISO (vienen del frontend) a fechas locales (para consultas en DB)
  static convertUTCtoLocal(date: Date | string): Date {
    return dayjs(date).utc().local().toDate()
  }

  // 🔥 Nuevo: convertir un rango recibido del frontend al rango local correcto
  static convertRangeToLocal(range: {
    inicio: Date | string
    fin: Date | string
  }) {
    return {
      inicio: this.convertUTCtoLocal(range.inicio),
      fin: this.convertUTCtoLocal(range.fin)
    }
  }
}

export default DateHelper

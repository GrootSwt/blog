<script>
import { formatTime, formatDate } from '@/utils/format'

export default {
  name: 'BaseMixin',
  methods: {
    formatTime (timestamp, format = 'yyyy-MM-dd HH:mm:ss') {
      return formatTime(timestamp, format)
    },
    formatDate (timestamp, format = 'yyyy-MM-dd') {
      return formatDate(timestamp, format)
    }
  }
}
</script>

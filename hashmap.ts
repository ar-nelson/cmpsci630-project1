 
module Python {
  export class ObjectHashMap {
    private buckets: PyObject[][][] = [
      [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []
    ]
    length = 0

    constructor() {}

    hasKey(key: PyObject): boolean {
      var bucket = this.buckets[Math.abs(key.hash() % this.buckets.length)]
      for (var i = 0; i < bucket.length; i++) {
        var cmp = key.richCompare(bucket[i][0], PyCompOp.EQ)
        if (cmp === NotImplemented) cmp = bucket[i][0].richCompare(key, PyCompOp.EQ)
        if (cmp === NotImplemented) cmp = key.richCompare(bucket[i][0], PyCompOp.IS)
        if (cmp !== NotImplemented && cmp.isTrue()) return true
      }
      return false
    }

    get(key: PyObject): PyObject {
      var bucket = this.buckets[Math.abs(key.hash() % this.buckets.length)]
      for (var i = 0; i < bucket.length; i++) {
        var cmp = key.richCompare(bucket[i][0], PyCompOp.EQ)
        if (cmp === NotImplemented) cmp = bucket[i][0].richCompare(key, PyCompOp.EQ)
        if (cmp === NotImplemented) cmp = key.richCompare(bucket[i][0], PyCompOp.IS)
        if (cmp !== NotImplemented && cmp.isTrue()) return bucket[i][1]
      }
      return null
    }

    put(key: PyObject, value: PyObject): PyObject {
      var bucket = this.buckets[Math.abs(key.hash() % this.buckets.length)]
      if (bucket.length > 0) {
        for (var i = 0; i < bucket.length; i++) {
          var cmp = key.richCompare(bucket[i][0], PyCompOp.EQ)
          if (cmp === NotImplemented) cmp = bucket[i][0].richCompare(key, PyCompOp.EQ)
          if (cmp === NotImplemented) cmp = key.richCompare(bucket[i][0], PyCompOp.IS)
          if (cmp !== NotImplemented && cmp.isTrue()) {
            var removed = bucket[i][1]
            bucket[i][1] = value
            return removed
          }
        }
      }
      bucket.push([key, value])
      this.length++
      return null
    }

    remove(key: PyObject): PyObject {
      var bucket = this.buckets[Math.abs(key.hash() % this.buckets.length)]
      if (bucket.length > 0) {
        for (var i = 0; i < bucket.length; i++) {
          var entry = bucket.shift()
          var cmp = key.richCompare(entry[0], PyCompOp.EQ)
          if (cmp === NotImplemented) cmp = entry[0].richCompare(key, PyCompOp.EQ)
          if (cmp === NotImplemented) cmp = key.richCompare(entry[0], PyCompOp.IS)
          if (cmp !== NotImplemented && cmp.isTrue()) {
            this.length--
            return entry[1]
          } else bucket.push(entry)
        }
      }
      return null
    }

    keys(): PyObject[] {
      var keys: PyObject[] = []
      for (var b = 0; b < this.buckets.length; b++) {
        for (var i = 0; i < this.buckets[b].length; i++) {
          keys.push(this.buckets[b][i][0])
        }
      }
      return keys
    }

    values(): PyObject[] {
      var values: PyObject[] = []
      for (var b = 0; b < this.buckets.length; b++) {
        for (var i = 0; i < this.buckets[b].length; i++) {
          values.push(this.buckets[b][i][1])
        }
      }
      return values
    }

    entries(): PyObject[][] {
      var entries: PyObject[][] = []
      for (var b = 0; b < this.buckets.length; b++) {
        entries = entries.concat(this.buckets[b])
      }
      return entries
    }
  }
}

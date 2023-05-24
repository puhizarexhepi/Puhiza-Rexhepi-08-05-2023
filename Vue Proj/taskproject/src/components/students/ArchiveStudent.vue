<template>
  <div v-if="activeName === 'archive'">
    <div class="container">
      <div class="h9">
        <el-row class="demo-autocomplete">
            <el-col :span="12">
              <el-input
                class="search"
                v-model="querySearch"
                placeholder="search"
                :trigger-on-focus="false"
              ></el-input>
            </el-col>
          </el-row>
      </div>
      <table>
        <thead>
          <tr class="h">
            <th style="border-right: 1px solid black">Index</th>
            <th
              style="border-right: 1px solid black">
              Name
              <i class="el-icon-arrow-down" @click="sortTable('name')"></i>
            </th>
            <th
              style="border-right: 1px solid black">
              Date of Birth
              <i class="el-icon-arrow-down" @click="sortTable('DoB')"></i>
            </th>
            <th
              style="border-right: 1px solid black">
              Municipality
              <i class="el-icon-arrow-down" @click="sortTable('municipality')"></i>
            </th>
            <th style="border-right: 1px solid black">Archive Data</th>
            <th style="border-right: 1px solid black">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in sortedArchive" :key="student.id">
            <td style="border-right: 1px solid black">{{ student.id }}</td>
            <td style="border-right: 1px solid black">{{ student.name }}</td>
            <td style="border-right: 1px solid black">{{ student.dateOfBirth }}</td>
            <td style="border-right: 1px solid black">{{ student.municipality }}</td>
            <td style="border-right: 1px solid black">2023-05-20</td>
            <td>
              <button class="button" @click="viewStudent(student)">View</button>
              <button class="button" @click="confirmRestore()">Restore</button>
            </td>
          </tr>
        </tbody>
      </table>
    <div v-if="showRestorePopup" class="modal">
    <div class="modal-content" style="gap:10px">
      <h3 class="modal-title">Restore Confirmation</h3>
      <p class="modal-message">Are you sure you want to restore the student?</p>
      <div class="modal-buttons">
        <button class="modal-button" @click="cancelRestore()">Cancel</button>
        <button class="modal-button" disabled @click="confirmRestore()">Yes</button>
      </div>
    </div>
    </div>
      <div class="pagination-wrapper">
        <el-pagination
          medium
          layout="prev, pager, next"
          :total="10"
        ></el-pagination>
      </div>
      <div v-if="showViewModal" class="modal">
        <div class="modal-content">
          <h3>View Student</h3>
          <div class="student-info">
   
            
             <p><strong>Name:</strong> {{ this.localSelectedStudentName }}</p>
            <p><strong>Date of Birth:</strong>{{ this.localSelectedStudentDateOfBirth }}</p>
            <p><strong>Municipality:</strong>{{ this.localSelectedStudentMunicipality}}</p> 
          </div>
          <div class="modal-buttons">
            <button @click="closeViewPopup">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default{
props: ['selectedStudentId', 'deletedStudents'],
  data() {
    return {
      activeName: "archive",
      status: null,
      local_model: null,
      querySearch: null,
      links: [],
      sortKey: "",
      sortDirection: "asc",
      sortColumn: "",
      students: [],
      showRestorePopup: false,
      showViewModal: false,
      localSelectedStudentId: null,
      localSelectedStudentName:null,
      localSelectedStudentMunicipality:null,
      localSelectedStudentDateOfBirth:null,
    }
  },
  computed: {
    filteredStudents() {
      let result = this.deletedStudents
        if (this.querySearch && this.querySearch.length > 0) {
          result = result.filter(
            (r) =>
                  r.name?.toLowerCase().includes(this.querySearch.toLowerCase()) ||
                  r.dateOfBirth?.toLowerCase().includes(this.querySearch.toLowerCase()) ||
                  r.municipality?.toLowerCase().includes(this.querySearch.toLowerCase())
          );
        }
      return result;
  },
    sortedArchive() {
      if (!Array.isArray(this.filteredStudents)) {
        return [];
    }
      const studentsCopy = [...this.filteredStudents];
      const sorted = studentsCopy.sort((a, b) => {
        if (this.sortDirection === "asc") {
          if (a[this.sortKey] > b[this.sortKey]) return 1;
          if (a[this.sortKey] < b[this.sortKey]) return -1;
          return 0;
        } else {
          if (a[this.sortKey] < b[this.sortKey]) return 1;
          if (a[this.sortKey] > b[this.sortKey]) return -1;
          return 0;
        }
      });
      return sorted;
    },
  selectedStudent: {
    get() {
      return this.students.find(student => student.id === this.localSelectedStudentId);
    },
    set(value) {
      this.localSelectedStudentId = value.id;
    }
  }
  },
 methods: {
    handleClick(tab) {
        this.activeName = tab.name;
    },
    viewStudent(student) {
      console.log("View Student:", student);
      this.localSelectedStudentId  = student.id;
      console.log("ss" + student.id);
      console.log(this.localSelectedStudentId);
      this.localSelectedStudentDateOfBirth= student.dateOfBirth;
      this.localSelectedStudentMunicipality=student.municipality;
      this.localSelectedStudentName=student.name;
      this.showViewModal = true;
    },
    closeViewPopup() {
    this.showViewModal = false;
    this.$emit('close');
  },
    cancelRestore() {
      this.showRestorePopup = false;
  },
    restoreStudent(student) {
    this.$emit('restore-student', student);
    },
    confirmRestore() {
      console.log('testrestore')
      this.showRestorePopup = true;
    },
    sortTable(key) {
      if (this.sortKey === key) {
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      } else {
        this.sortKey = key;
        this.sortDirection = "asc";
      }
    },
    sortIcon(key) {
      if (this.sortKey === key) {
        return this.sortDirection === "asc"
          ? "fas fa-arrow-up"
          : "fas fa-arrow-down";
      } else {
        return "";
      }
    },
    sortClasses(key) {
      return {
        sorted: this.sortKey === key,
        asc: this.sortKey === key && this.sortDirection === "asc",
        desc: this.sortKey === key && this.sortDirection === "desc",
      };
    },
    getKeyValue(obj, key) {
      if (!obj || !key) return "";
      const keys = key.split(".");
      let value = obj;
      for (let i = 0; i < keys.length; i++) {
        value = value[keys[i]];
        if (!value) break;
      }
      return value || "";
    }
  },
  watch: {
    selectedStudentId(newVal) {
      this.localSelectedStudentId = newVal;
    },
    localSelectedStudentId(newVal) {
      this.$emit('update:selectedStudentId', newVal);
    },
  },
  created() {
    this.localSelectedStudentId = this.selectedStudentId;
  },
  mounted() {
  this.localSelectedStudentId = this.selectedStudentId;
},
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
table {
  width: 70%;
  border-collapse: collapse;
  border: 1px solid black;
}
.h {
  background-color: rgb(223, 223, 223);
}
.h9 {
  width: 70%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.search {
  margin: 40px 0px 20px 0px;
  width: 400%;
}
.pagination-wrapper {
  width: 45%;
  align-self: flex-end;
  margin-top: 20px;
}
th,
td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
.button {
  gap: 10px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 14px;
  border: none;
  color: rgb(80, 80, 255);
  text-decoration: underline;
  background-color: white;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background-color: #fff;
  padding: 20px 70px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 400px;
  text-align: center;
}
.modal-form {
  display: grid;
  gap: 30px;
  margin-top: 40px;
}
.modal-label {
  font-weight: bold;
}
.modal-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px;
}
/* .form-row {
  display: grid;
  grid-template-columns: max-content 1fr;
  align-items: center;
  gap: 10px;
} */
.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
.modal-buttons button {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 14px;
  padding: 4px 10px;
  background-color: #e9e9e9;
}
.column-inputs {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
/* .column-inputs .form-row {
  display: flex;
  align-items: center;
} */
/* .column-inputs .form-row label {
  width: 120px;
  text-align: left;
  padding-right: 10px;
} */
.modal-message {
  margin-bottom: 20px;
}
.student-info {
  display: flex;
  align-items: center;
  padding: 7px;
  flex-direction: column;
  font-weight: bold;
  align-items: flex-start;
}
</style>

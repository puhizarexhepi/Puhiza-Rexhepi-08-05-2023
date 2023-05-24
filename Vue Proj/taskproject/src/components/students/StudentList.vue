<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="Home" name="first">
        <h4>Simple. Secure. Mobile.</h4>
        <h1>Next Generation Hospitality Platform</h1>
        <h2>A global system trusted by thousands.</h2>
      </el-tab-pane>
      <el-tab-pane label="Students" name="students"></el-tab-pane>
      <el-tab-pane label="Archive" name="archive">
        <ArchiveStudent v-if="deletedStudent"
          :deletedStudents="deletedStudents"
          :selectedStudentId="selectedStudentId"/>
      </el-tab-pane>
      <el-tab-pane label="Help" name="help">
        <h1>HotelKey Support</h1>
        <h3>Ready to help, All around the world</h3></el-tab-pane>
    </el-tabs>
    <div v-if="activeName === 'students'">
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
          <div>
            <el-button
              type="primary"
              class="register-button"
              @click="openRegisterPopup"
              >Register new student</el-button
            >
          </div>
        </div>
        <table :data="sortedStudents" > 
          <thead>
            <tr class="h">
              <th style="border-right: 1px solid black">Index</th>
              <th
                :class="sortClasses('name')"
                style="border-right: 1px solid black">
                Name
                <i class="el-icon-arrow-down" @click="sortTable('name')"></i>
              </th>
              <th
                :class="sortClasses('dateOfBirth')"
                style="border-right: 1px solid black">
                Date of Birth
                <i class="el-icon-arrow-down" @click="sortTable('DoB')"></i>
              </th>
              <th
                :class="sortClasses('municipality')"
                style="border-right: 1px solid black">
                Municipality
                <i class="el-icon-arrow-down" @click="sortTable('municipality')"></i>
              </th>
              <th style="border-right: 1px solid black">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in paginatedStudents" :key="student.id">
              <td style="border-right: 1px solid black">{{ student.id }}</td>
              <td style="border-right: 1px solid black">{{ student.name }}</td>
              <td style="border-right: 1px solid black">{{ student.dateOfBirth }}</td>
              <td style="border-right: 1px solid black">{{ student.municipality }}</td>
              <td>
                <button class="button" @click="editStudent(student)">Edit</button>
                <button class="button" @click="showDeleteConfirmation(student.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="pagination-wrapper">
          <el-pagination 
            medium layout="prev, pager, next"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="totalStudents"
            @current-change="handlePageChange"

          ></el-pagination>
        </div>
      </div>
    </div>
    <add-edit-student
      v-if="showEditModal"
      :status="status"
      :studentDetails="local_model"
      :students="students"
      :showEditModal="showEditModal"
      @close="closeEditModal"
      @save-edited-student="saveEditedStudent"
    ></add-edit-student>
    <delete-student
      v-if="showDeletePopup"
      :showDeletePopup="showDeletePopup"
      :selectedStudentId="selectedStudentId"
      @cancel-delete="cancelDelete"
      @close="moveToArchive"
    ></delete-student>
  </div>
</template>

<script>
import AddEditStudent from "../students/AddEditStudent.vue";
import DeleteStudent from "../students/DeleteStudent.vue";
import ArchiveStudent from "../students/ArchiveStudent.vue";
export default {
  components: { AddEditStudent, DeleteStudent, ArchiveStudent },
  data() {
    return {
      activeName: "first",
      status: null,
      local_model: null,
      querySearch: null,
      links: [],
      currentPage: 1,
      pageSize: 10,
      sortKey: "",
      sortDirection: "asc",
      sortColumn: "",
      selectedStudentId: null,
      students: [
        {
          id: 1458,
          name: "Mergim Bajrami",
          dateOfBirth: "1989-10-05",
          municipality: "Prishtine",
        },
        {
          id: 1452,
          name: "Blerton Rexha",
          dateOfBirth: "1989-10-05",
          municipality: "Prishtine",
        },
        {
          id: 1461,
          name: "Abdullah Krasniqi",
          dateOfBirth: "1989-10-05",
          municipality: "Prishtine",
        },
        {
          id: 1472,
          name: "Sami Salihu",
          dateOfBirth: "1989-10-05",
          municipality: "Prishtine",
        },
        {
          id: 1491,
          name: "Visar Uruqi",
          dateOfBirth: "1989-10-05",
          municipality: "Prishtine",
        },
        {
          id: 1432,
          name: "Naim Krasniqi",
          dateOfBirth: "1989-10-05",
          municipality: "Prishtine",
        },
      ],
      newStudent: {
        name: "",
        dateOfBirth: "",
        municipality: "",
      },
      showEditModal: false,
      showDeletePopup: false,
      showRegisterPopup: false,
      validateOnSave: false,
      selectedStudent: null,
      deletedStudent: null,
      updatedStudents: [],
      deletedStudents: [],
    };
  },
  computed: {
    filteredStudents() {
      let result = this.students;
      if (this.querySearch && this.querySearch.length > 0) {
        result = result.filter(
          (r) =>
            r.name?.toLowerCase().includes(this.querySearch.toLowerCase()) ||
            r.dateOfBirth
              ?.toLowerCase()
              .includes(this.querySearch.toLowerCase()) ||
            r.municipality
              ?.toLowerCase()
              .includes(this.querySearch.toLowerCase())
        );
      }
      return result;
    },
    totalStudents() {
      return this.sortedStudents.length;
    },
    paginatedStudents() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.sortedStudents.slice(startIndex, endIndex);
    },
    pageCount() {
      return Math.ceil(this.sortedStudents.length / this.pageSize);
    },
    sortedStudents() {
      const studentsCopy = [...this.filteredStudents];
      const sorted = studentsCopy.sort((a, b) => {
        const keyA = this.getKeyValue(a, this.sortKey);
        const keyB = this.getKeyValue(b, this.sortKey);
        return this.sortDirection === "asc"
          ? keyA.localeCompare(keyB)
          : keyB.localeCompare(keyA);
      });
      return sorted;
    },
    sortedArchive() {
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
  },
  methods: {
    saveEditedStudent(updatedStudent) {
      const index = this.students.findIndex(
        (student) => student.id === updatedStudent.id
      );
      if (index !== -1) {
        this.students.splice(index, 1, updatedStudent);
      }
    },
    handleClick(tab) {
      this.activeName = tab.name;
    },
    handlePageChange(currentPage) {
      this.currentPage = currentPage ;
      console.log(this.currentPage);
    },
    selectStudent(studentId) {
      this.selectedStudentId = studentId;
    },
    editStudent(student) {
      this.status = "edit";
      this.local_model = student;
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
      this.selectedStudent = null;
      this.editedStudent = {
        name: "",
        dateOfBirth: "",
        municipality: "",
      };
    },
    openRegisterPopup() {
      this.newStudent = {
        name: "",
        dateOfBirth: "",
        municipality: "",
      };
      this.status = "add";
      this.showEditModal = true;
    },
    closeRegisterPopup() {
      this.showRegisterPopup = false;
    },

    validateAndRegister() {
      const inputs = document.querySelectorAll(".modal-input");
      let isValid = true;

      inputs.forEach((input) => {
        if (input.value.trim() === "") {
          isValid = false;
        }
      });

      if (isValid) {
        const newStudentId =
          Math.max(...this.students.map((student) => student.id)) + 1;

        const newStudent = {
          id: newStudentId,
          name: this.newStudent.name,
          dateOfBirth: this.newStudent.dateOfBirth,
          municipality: this.newStudent.municipality,
        };

        this.students.push(newStudent);

        this.newStudent = {
          name: "",
          dateOfBirth: "",
          municipality: "",
        };
        this.showRegisterPopup = false;
      }
    },
    moveToArchive() {
      this.deletedStudent = this.students.find(
        (student) => student.id === this.selectedStudentId
      );
      if (this.deletedStudent) {
        this.updatedStudents = this.students.filter(
          (student) => student.id !== this.selectedStudentId
        );
        this.deletedStudents.push({ ...this.deletedStudent });
        this.students = this.updatedStudents
        this.$emit("move-to-archive", this.deletedStudent);
      }
      this.showDeletePopup = false;
    },
    // handleRestoreStudent(restoredStudent) {
    //   this.students.push(restoredStudent);
    // },
    deleteStudent(studentId) {
      this.selectedStudentId = studentId;
      this.showDeletePopup = true;
    },
    showDeleteConfirmation(studentId) {
      this.selectedStudentId = studentId;
      this.showDeletePopup = true;
    },
    cancelDelete() {
      this.showDeletePopup = false;
      this.selectedStudentId = null;
    },
    // confirmDelete() {
    //   console.log("testtt12");
    //   const index = this.students.findIndex(
    //     (student) => student.id === this.selectedStudentId
    //   );

    //   if (index !== -1) {
    //     this.students.splice(index, 1);
    //     console.log("Student deleted successfully");
    //   } else {
    //     console.log("Student not found");
    //   }

    //   this.showDeletePopup = false;
    //   this.selectedStudentId = null;
    // },
    sortTable(key) {
      if (this.sortKey === key) {
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      } else {
        this.sortKey = key;
        this.sortDirection = "asc";
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
    },
  },
};
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
.register-button {
  float: right;
  margin-top: 10px;
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
.modal-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px;
}
</style>

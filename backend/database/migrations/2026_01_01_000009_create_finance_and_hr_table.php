<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->string('reference', 50);
            $table->uuid('customer_id')->references('id')->on('customers')->onDelete('restrict');
            $table->decimal('amount', 15, 2);
            $table->date('due_date');
            $table->string('status', 50)->default('pending');
            $table->timestamps();
            $table->unique(['company_id', 'reference']);
        });

        Schema::create('expenses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->string('reference', 50);
            $table->string('category');
            $table->string('description');
            $table->decimal('amount', 15, 2);
            $table->date('expense_date');
            $table->string('status', 50)->default('approved');
            $table->timestamps();
        });

        Schema::create('departments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->string('name');
            $table->integer('headcount')->default(0);
            $table->integer('open_roles')->default(0);
            $table->timestamps();
        });

        Schema::create('employees', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->string('name');
            $table->string('role');
            $table->string('department');
            $table->string('status', 50)->default('active');
            $table->decimal('attendance_percentage', 5, 2)->default(100.00);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
        Schema::dropIfExists('departments');
        Schema::dropIfExists('expenses');
        Schema::dropIfExists('invoices');
    }
};

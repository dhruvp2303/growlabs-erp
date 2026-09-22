<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->uuid('current_company_id')->nullable()->references('id')->on('companies')->onDelete('set null');
            $table->boolean('is_active')->default(true);
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('company_users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->uuid('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
            $table->unique(['company_id', 'user_id']);
        });

        Schema::create('roles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->string('name');
            $table->string('display_name');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('permissions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique();
            $table->string('category');
            $table->text('description')->nullable();
        });

        Schema::create('role_permissions', function (Blueprint $table) {
            $table->uuid('role_id')->references('id')->on('roles')->onDelete('cascade');
            $table->uuid('permission_id')->references('id')->on('permissions')->onDelete('cascade');
            $table->primary(['role_id', 'permission_id']);
        });

        Schema::create('user_roles', function (Blueprint $table) {
            $table->uuid('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->uuid('role_id')->references('id')->on('roles')->onDelete('cascade');
            $table->uuid('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->primary(['user_id', 'role_id', 'company_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_roles');
        Schema::dropIfExists('role_permissions');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
        Schema::dropIfExists('company_users');
        Schema::dropIfExists('users');
    }
};
